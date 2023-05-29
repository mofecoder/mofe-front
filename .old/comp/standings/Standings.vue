<template>
  <v-card>
    <v-card-title>順位表</v-card-title>
    <v-card-text class="standings">
      <v-btn color="primary" @click="$emit('reload')">更新する</v-btn>
      <div class="standings__wrap">
        <table class="standings__table">
          <thead>
            <tr class="row-header">
              <th class="col-rank">順位</th>
              <th class="col-username">ユーザ名</th>
              <td class="col-result">得点</td>
              <td
                v-for="problem in problems"
                :key="problem.slug"
                class="col-problem"
              >
                <NuxtLink
                  :to="`/contests/${contestName}/tasks/${problem.slug}`"
                >
                  {{ problem.position }}
                </NuxtLink>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="user in standings"
              :key="user.user.name"
              class="row-user"
            >
              <td>{{ user.rank }}</td>
              <th class="user-name">
                <StandingsUserName :user="user.user" />
              </th>
              <td class="col-result">
                <div class="score score--sum">
                  <span class="point">{{ user.result.score }}</span>
                  <span v-if="user.result.penalty" class="penalty"
                    >({{ user.result.penalty }})</span
                  >
                </div>
                <div class="time">{{ formatTime(user.result.time) }}</div>
              </td>
              <td
                v-for="(problem, index) in user.problems"
                :key="`${problems[index].slug}-${user.user.name}`"
              >
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
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="row-footer">
              <td colspan="3">
                <span class="solved">正解者数</span>
                <span class="tried">/ 提出者数</span>
              </td>
              <td v-for="problem in problems" :key="`foot-${problem.slug}`">
                <span class="solved">{{ problem.solved }}</span>
                <span class="tried">/ {{ problem.tried }}</span>
              </td>
            </tr>
            <tr class="row-fa">
              <td colspan="3">
                <span class="head">最速正解者</span>
              </td>
              <td v-for="problem in problems" :key="`foot-${problem.slug}`">
                <template v-if="problem.firstAccept">
                  <p class="user">
                    <StandingsUserName :user="problem.firstAccept.user" />
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

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { StandingProblem, Standing } from '~/types/standings'
import StandingsUserName from '../../comp/standings/StandingsUserName.vue'
@Component({
  components: { StandingsUserName }
})
export default class Standings extends Vue {
  @Prop({ required: true })
  problems!: StandingProblem[]

  @Prop({ required: true })
  standings!: Standing[]

  formatTime(time: number | undefined): string {
    if (!time) return ''
    const hour = Math.floor(time / 3600)
    const min = Math.floor((time % 3600) / 60)
    const sec = time % 60
    const secStr = `00${sec}`.substr(-2)
    const minStr = `00${min}`.substr(-2)
    return hour ? `${hour}:${minStr}:${secStr}` : `${min}:${secStr}`
  }

  get contestName() {
    return this.$route.params.contestName
  }
}
</script>

<style scoped lang="scss">
.standings {
  @include card-text-reset();

  &__wrap {
    padding: 1em;
  }

  &__table {
    border-collapse: collapse;
    text-align: center;
    border: #cccccc solid 1px;

    .row-header {
      .col-rank {
        width: 4em;
      }

      .col-username {
        width: 10em;
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

      .score {
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
      }

      .score--sum .point {
        color: darkblue;
        font-weight: bold;
      }

      .time {
        color: gray;
        font-size: 0.9rem;
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

    th,
    td {
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
