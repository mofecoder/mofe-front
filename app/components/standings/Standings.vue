<template>
  <v-card>
    <v-card-title>順位表</v-card-title>
    <v-card-text class="standings">
      <div class="standings__wrap">
        <table class="standings__table">
          <thead>
            <tr class="row-header">
              <th class="col-username">ユーザ名</th>
              <td class="col-result">得点</td>
              <td class="col-problem">
                <n-link
                  v-for="problem in problems"
                  :key="problem.slug"
                  :to="`/contests/${contestName}/tasks/${problem.slug}`"
                >
                  {{ problem.position }}
                </n-link>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in standings" :key="user.userName" class="row-user">
              <th>{{ user.userName }}</th>
              <td class="col-result">
                <div class="score">
                  <span class="point">{{ user.result.score }}</span>
                  <span v-if="user.result.penalty" class="penalty"
                    >({{ user.result.penalty }})</span
                  >
                </div>
                <div class="time">{{ formatTime(user.result.time) }}</div>
              </td>
              <td
                v-for="(problem, index) in user.problems"
                :key="`${problems[index].slug}-${user.userName}`"
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
              <th />
              <td class="col-result" />
              <td v-for="problem in problems" :key="`foot-${problem.slug}`">
                <span class="solved">{{ problem.solved }}</span>
                <span class="tried">/ {{ problem.tried }}</span>
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

@Component
export default class Standings extends Vue {
  @Prop({ required: true })
  problems!: StandingProblem[]

  @Prop({ required: true })
  standings!: Standing[]

  formatTime(time: number | undefined): string {
    if (!time) return ''
    const min = Math.floor(time / 60)
    const sec = time % 60
    let secStr = `00${sec}`
    secStr = secStr.substring(secStr.length - 2)
    return `${min}:${secStr}`
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

      .time {
        color: gray;
        font-size: 0.9rem;
      }
    }

    .row-footer {
      border-top-width: 2px;
      font-size: 0.9rem;

      .solved {
        color: green;
        font-weight: bold;
      }

      .tried {
        color: #666666;
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

    .row-footer {
      background-color: #f3fff5;
    }
  }
}
</style>
