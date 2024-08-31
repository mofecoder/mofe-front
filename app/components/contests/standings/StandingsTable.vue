<script setup lang="ts">
import type { StandingProblem, Standing } from '~/types/standings'

const props = defineProps<{
  problems: StandingProblem[]
  standings: Standing[]
  mode: string
  team?: boolean
  loading?: boolean
  excludeOpen?: boolean
  closedMode?: boolean
  teamMode?: boolean
  sortColumn: string | null
  sortOrder: 'asc' | 'desc' | null
  submissionsPath: string | null
}>()

const emit = defineEmits<{
  reload: []
  'update:closedMode': [boolean]
  'update:teamMode': [boolean]
  'update:showTeamMembers': [boolean]
  'update:sortColumn': [string | null]
  'update:sortOrder': ['asc' | 'desc' | null]
}>()

const formatTime = (time: number | undefined): string => {
  if (!time) return ''
  const hour = Math.floor(time / 3600)
  const min = Math.floor((time % 3600) / 60)
  const sec = time % 60
  const secStr = sec.toString().padStart(2, '0')
  const minStr = min.toString().padStart(2, '0')
  return hour ? `${hour}:${minStr}:${secStr}` : `${min}:${secStr}`
}

const route = useRoute()
const contestName = computed(() => route.params.contestName)
const teamModeComputed = computed({
  get: () => props.teamMode,
  set: (value) => emit('update:teamMode', value)
})

const closedModeComputed = computed({
  get: () => props.closedMode,
  set: (value) => emit('update:closedMode', value)
})

const showTeamMembers = ref(false)

function updateSort(column: string | null) {
  if (!column) {
    emit('update:sortColumn', null)
    emit('update:sortOrder', null)
  } else if (column === props.sortColumn) {
    if (props.sortOrder === 'desc') emit('update:sortOrder', 'asc')
    else {
      emit('update:sortColumn', null)
      emit('update:sortOrder', null)
    }
  } else {
    emit('update:sortColumn', column)
    emit('update:sortOrder', 'desc')
  }
}
</script>

<template>
  <v-sheet :loading="loading" variant="flat" theme="light">
    <h2>順位表</h2>
    <div class="standings my-2">
      <div class="mb-4">
        <v-btn
          color="secondary"
          variant="tonal"
          prepend-icon="mdi-reload"
          @click="$emit('reload')"
        >
          更新する
        </v-btn>
        <div class="standings-checkbox-wrapper">
          <v-checkbox
            v-if="team"
            v-model="teamModeComputed"
            label="チーム参加のみ表示"
            color="primary"
            density="compact"
            hide-details
          />
          <v-checkbox
            v-if="team"
            v-model="showTeamMembers"
            label="チームメンバーを常に表示"
            color="purple"
            density="compact"
            hide-details
          />
          <v-checkbox
            v-if="excludeOpen"
            v-model="closedModeComputed"
            label="オープン参加を非表示"
            color="secondary"
            density="compact"
            persistent-hint
            :hint="
              teamModeComputed
                ? ''
                : `斜体のユーザ${team ? '・チーム' : ''}がオープン参加です`
            "
          />
        </div>
      </div>
      <div class="standings__wrap">
        <table class="standings__table">
          <thead>
            <tr class="row-header">
              <th class="col-rank" @click="updateSort(null)">順位</th>
              <th class="col-username">ユーザ名</th>
              <th class="col-result">得点</th>
              <th
                v-for="problem in problems"
                :key="problem.slug"
                class="col-problem"
                @click="updateSort(problem.position)"
              >
                <NuxtLink
                  :to="`/contests/${contestName}/tasks/${problem.slug}`"
                >
                  {{ problem.position }}
                </NuxtLink>
                <v-icon
                  :class="[
                    'ms-2',
                    'sort-icon',
                    sortColumn === problem.position &&
                      sortOrder == 'desc' &&
                      'sort-reverse'
                  ]"
                  size="small"
                  :color="sortColumn === problem.position ? 'success' : 'gray'"
                >
                  {{
                    sortColumn !== problem.position
                      ? 'mdi-sort'
                      : sortOrder === 'desc'
                        ? 'mdi-sort-descending'
                        : 'mdi-sort-ascending'
                  }}
                </v-icon>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="user in standings"
              :key="user.user.name"
              class="row-user"
            >
              <td>{{ user.rank }}</td>
              <th class="user-name" :class="user.user.open && 'open'">
                <ContestsStandingsUserName
                  :user="user.user"
                  :show-team-members="showTeamMembers"
                  :submissions="submissionsPath"
                />
              </th>
              <td v-if="mode === 'atcoder'" class="col-result">
                <div class="score score--sum">
                  <span class="point">{{ user.result.score }}</span>
                  <span v-if="user.result.penalty" class="penalty">
                    ({{ user.result.penalty }})
                  </span>
                </div>
                <div class="time">{{ formatTime(user.result.time) }}</div>
              </td>
              <td v-else class="col-result">
                <div class="score score--sum">
                  <span class="point">{{ user.result.score }}</span>
                </div>
                <div class="time">{{ user.result.time }}</div>
              </td>
              <td
                v-for="(problem, index) in user.problems"
                :key="`${problems[index].slug}-${user.user.name}`"
                class="col-problem"
              >
                <template v-if="mode === 'atcoder'">
                  <div class="score">
                    <span class="point">{{ problem.score }}</span>
                    <span
                      v-if="problem.penalty != null"
                      class="penalty"
                      :class="{ 'no-pena': problem.penalty === 0 }"
                    >
                      ({{ problem.penalty }})
                    </span>
                  </div>
                  <div class="time">
                    {{ formatTime(problem.time) }}
                  </div>
                </template>
                <template v-else>
                  <div
                    class="icpc-score"
                    :class="{
                      solved: !!problem.score,
                      'penalty-only': !problem.score && !!problem.penalty
                    }"
                  >
                    <div class="time">
                      {{ formatTime(problem.time) || '-' }}
                    </div>
                    <div v-if="problem.penalty" class="penalty">
                      (+{{ problem.penalty }})
                    </div>
                    <div v-else class="no-penalty">-</div>
                  </div>
                </template>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="row-footer">
              <td colspan="3">
                <span class="solved">正解者数</span>
                <span class="tried"> / 提出者数</span>
              </td>
              <td v-for="problem in problems" :key="`foot-${problem.slug}`">
                <span class="solved">{{ problem.solved }}</span>
                <span class="tried"> / {{ problem.tried }}</span>
              </td>
            </tr>
            <tr class="row-fa">
              <td colspan="3">
                <span class="head">最速正解者</span>
              </td>
              <td v-for="problem in problems" :key="`foot-${problem.slug}`">
                <template v-if="problem.firstAccept">
                  <p class="user">
                    <ContestsStandingsUserName
                      :user="problem.firstAccept.user"
                    />
                  </p>
                  <p
                    class="time"
                    v-text="formatTime(problem.firstAccept.time)"
                  />
                </template>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </v-sheet>
</template>

<style scoped lang="scss">
@import '../../../styles/card-reset';
.standings-checkbox-wrapper {
  display: flex;
  flex-wrap: wrap;
  column-gap: 24px;
}
.standings {
  @include card-text-reset();

  font-size: 0.875rem;
  letter-spacing: 0.0178571429em;

  &__wrap {
    text-wrap: avoid;
    padding-top: 2em;
    overflow-x: scroll;
  }

  &__table {
    border-collapse: collapse;
    text-align: center;
    border: #a0a0a0 solid 2px;
    margin: 0 auto;

    td,
    th {
      &:not(:last-child) {
        border-right: #e0e0e0 solid 1px;
      }
    }
    tr {
      border-top: #e0e0e0 solid 1px;
    }

    .row-header {
      position: sticky;
      z-index: 2;

      .col-rank {
        min-width: 6em;
        cursor: pointer;
      }

      .col-username {
        min-width: 10em;
      }

      .col-result {
        min-width: 6em;
      }

      .col-problem {
        min-width: 5.5em;
        cursor: pointer;

        .sort-reverse {
          transform: scaleY(-1);
        }
      }

      th,
      td {
        border-bottom-width: 2px;
      }
    }

    .row-user {
      .user-name {
        color: #5200ab;
        padding: 0 0.3em;

        &.open {
          font-style: italic;
        }

        :deep(a) {
          text-decoration: none;
        }
      }

      td {
        padding: 0.2em 0;
      }

      .col-result,
      .col-problem {
        padding-left: 0.6em;
        padding-right: 0.6em;
      }

      .score {
        flex-direction: column;
        justify-content: space-between;
        font-size: 0.95rem;
        .point {
          color: green;
          font-weight: 500;
        }

        .penalty {
          color: red;
          font-size: 0.8em;

          &.no-pena {
            color: #666666;
          }
        }
      }
      .time {
        color: gray;
        font-size: 0.85rem;
      }
      .icpc-score {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin: 2px 4px;
        padding: 6px;

        &.solved {
          background: #86ea86;
        }
        &.penalty-only {
          background: #ffbbdf;
        }

        .time {
          font-size: 19px;
        }

        .penalty {
          color: #ab0a0a;
          font-weight: bold;
          font-size: 16px;
        }

        .icpc-no-penalty {
          color: #666666;
          font-size: 16px;
        }
      }

      .score--sum .point {
        color: darkblue;
        font-weight: bold;
      }

      &__no-rating {
        color: #5200ab;
      }
    }

    .row-footer {
      border: solid #e0e0e0;
      border-width: 1px 0 1px;
      font-size: 0.8rem;

      .solved {
        color: green;
        font-weight: bold;
      }

      .tried {
        color: #666666;
      }
    }

    .row-fa {
      .user {
        color: #5200ab;
        font-size: 0.9em;
        font-weight: bold;
        padding: 0 0.25em;
      }

      .time {
        color: gray;
        font-size: 0.8rem;
      }

      .head {
        color: #666666;
      }

      p {
        margin: 2px 0 2px;
      }
    }

    th {
      padding: 0.3rem 0;
    }

    // 背景色関連
    thead {
      background-color: #ffffe0;
    }

    tr:nth-child(even) {
      background-color: #eff4ff;
    }

    .row-fa,
    .row-footer {
      background-color: #faf5fd !important;
    }
  }
}
</style>
