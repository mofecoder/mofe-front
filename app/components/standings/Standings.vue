<template>
  <v-card>
    <v-card-title>順位表</v-card-title>
    <v-card-text class="standings">
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
                <n-link :to="`/contests/${contestName}/tasks/${problem.slug}`">
                  {{ problem.position }}
                </n-link>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in standings" :key="user.userName" class="row-user">
              <td>{{ user.rank }}</td>
              <th :style="{ color: atcoderColor(user.user.atcoderRating) }">
                {{ user.user.name }}
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
              <td />
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

  atcoderColor(rating: number | null) {
    if (rating === null) return '#5200ab'
    if (rating === 0) return '#000000'
    switch (Math.floor(rating / 400)) {
      case 0:
        return '#808080'
      case 1:
        return '#804000'
      case 2:
        return '#008000'
      case 3:
        return '#00c0c0'
      case 4:
        return '#0000ff'
      case 5:
        return '#c0c000'
      case 6:
        return '#ff8000'
      default:
        return '#ff0000'
    }
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
