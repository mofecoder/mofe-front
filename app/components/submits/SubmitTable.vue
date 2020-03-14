<template>
  <table class="submits">
    <thead>
      <tr>
        <th class="date">日時</th>
        <th class="user">ユーザ</th>
        <th class="task">問題</th>
        <th class="points">得点</th>
        <th class="results">結果</th>
        <th class="time">実行時間</th>
        <th class="memory">メモリ使用量</th>
        <th class="detail">詳細</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in submits" :key="item.id">
        <td>{{ formatDate(item.timestamp) }}</td>
        <td>{{ item.user.name }}</td>
        <td>
          <n-link :to="`/contests/${slug}/tasks/${item.task.slug}`"
            >{{ item.task.position }}: {{ item.task.name }}</n-link
          >
        </td>
        <td style="text-align:right;padding-right:0.5em">
          {{ item.points }}
        </td>
        <template v-if="item.executionTime && item.memory">
          <td>
            <div class="cell-result">
              <div :class="`result-${item.result}`">{{ item.result }}</div>
            </div>
          </td>
          <td>{{ item.executionTime }} ms</td>
          <td>{{ item.memory }} KB</td>
        </template>
        <td v-else class="cell-result" rowspan="3">
          <div class="cell-result">
            <div :class="`result-${item.result}`">{{ item.result }}</div>
          </div>
        </td>
        <td>
          <n-link :to="`/contests/${slug}/submits/${item.id}`">詳細</n-link>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { Submit } from '~/types/submits'
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import dayjs from 'dayjs'

@Component
export default class SubmitTable extends Vue {
  @Prop({ required: true })
  submits!: Submit[]

  get slug(): string {
    return this.$route.params.contestName
  }

  formatDate(date: Date): string {
    const dt = dayjs(date)
    return dt.format('YYYY/MM/DD HH:mm:ss')
  }
}
</script>

<style lang="scss" scoped>
.submits {
  border-collapse: collapse;
  table,
  th,
  td {
    border: solid 1px black;
  }
  td {
    padding: 0.3em 0;
  }
  text-align: center;
  .date {
    width: 16em;
    min-width: 11em;
  }
  $width-map: (
    user: 8em,
    task: 16em,
    results: 6em,
    points: 5em,
    time: 7em,
    memory: 7em,
    detail: 4em
  );
  @each $class, $width in $width-map {
    .#{$class} {
      width: $width;
    }
  }
  tbody:nth-child(even) {
    background-color: #fffff8;
  }
  tbody td {
    height: 2.4em;
  }
  .cell-result {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    $color-ac: #11bb22;
    $color-wa: #f0b000;
    $color-wj: #888888;
    $color-ie: #ff4444;
    $color-ce: #cc44ff;
    div {
      border-radius: 4px;
      color: white;
      font-weight: bold;
      font-size: 120%;
      width: 3.3em;
    }
    .result-AC {
      background-color: $color-ac;
    }
    .result-TLE,
    .result-MLE,
    .result-WA,
    .result-RE,
    .result-OLE {
      background-color: $color-wa;
    }
    .result-IE {
      background-color: $color-ie;
    }
    .result-CE {
      background-color: $color-ce;
    }
    .result-WJ {
      background-color: $color-wj;
    }
  }
}
</style>
