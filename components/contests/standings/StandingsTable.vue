<script setup lang="ts">
import { StandingProblem, Standing } from '~/types/standings'

const props = defineProps({
  problems: {
    type: Array as () => StandingProblem[],
    required: true
  },
  standings: {
    type: Array as () => Standing[],
    required: true
  },
  mode: {
    type: String,
    required: true
  },
  teamPrefix: {
    type: String,
    required: false,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
})

defineEmits<{
  reload: []
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
const teamMode = ref(false)

type FilteredStanding = Standing & { rank: string | number }

const filteredStandings = computed((): FilteredStanding[] => {
  if (!props.standings) return []
  if (!teamMode.value || !props.teamPrefix) return props.standings

  const ranks = new Map<number, number>()
  const filtered: FilteredStanding[] = props.standings.filter((s) =>
    s.user.name.startsWith(props.teamPrefix)
  )
  for (let i = 0; i < filtered.length; ++i) {
    if (ranks.has(filtered[i].rank)) {
      filtered[i].rank = ranks.get(filtered[i].rank)!
    } else {
      ranks.set(filtered[i].rank, i + 1)
      filtered[i].rank = i + 1
    }
  }
  return filtered
})
</script>

<template>
  <v-card :loading="loading">
    <v-card-title>順位表</v-card-title>
    <v-card-text class="standings">
      <div class="mb-4">
        <v-btn color="primary" @click="$emit('reload')">更新する</v-btn>
        <v-switch
          v-if="teamPrefix"
          v-model="teamMode"
          label="チーム参加のみ表示"
          class="mt-4"
          density="compact"
          hide-details
        />
      </div>
      <div class="standings__wrap">
        <table class="standings__table">
          <thead>
            <tr class="row-header">
              <th class="col-rank">順位</th>
              <th class="col-username">ユーザ名</th>
              <th class="col-result">得点</th>
              <th
                v-for="problem in problems"
                :key="problem.slug"
                class="col-problem"
              >
                <NuxtLink
                  :to="`/contests/${contestName}/tasks/${problem.slug}`"
                >
                  {{ problem.position }}
                </NuxtLink>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="user in filteredStandings"
              :key="user.user.name"
              class="row-user"
            >
              <td>{{ user.rank }}</td>
              <th class="user-name">
                <ContestsStandingsUserName :user="user.user" />
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
                      solved: problem.score > 0,
                      'penalty-only': !problem.score && problem.penalty > 0
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
    </v-card-text>
  </v-card>
</template>

<style scoped lang="scss">
@import 'styles/card-reset';
.standings {
  @include card-text-reset();

  &__wrap {
    text-wrap: nowrap;
    padding-top: 2em;
    overflow-x: scroll;
  }

  &__table {
    border-collapse: collapse;
    text-align: center;
    border: #cccccc solid 1px;
    margin: 0 auto;

    .row-header {
      .col-rank {
        min-width: 6em;
      }

      .col-username {
        min-width: 10em;
      }

      .col-result {
        width: 8em;
        min-width: 5em;
      }

      .col-problem {
        min-width: 5em;
        width: 7em;
      }

      th,
      td {
        border-bottom-width: 2px;
      }
    }

    .row-user {
      .user-name {
        color: #5200ab;

        > a {
          text-decoration: none;
        }
      }

      td {
        padding: 0.4em 0;
      }

      .score {
        flex-direction: column;
        justify-content: space-between;
        .point {
          color: green;
          font-size: 1.2rem;
        }

        .penalty {
          color: red;

          &.no-pena {
            color: #666666;
          }
        }
        .time {
          color: gray;
          font-size: 0.9rem;
        }
      }
      .icpc-score {
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        &.solved {
          background: #86ea86;
        }
        &.penalty-only {
          background: #ffbbdf;
        }

        margin: 2px 4px;
        padding: 6px;

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

        > a {
          text-decoration: none;
        }
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
