<template>
  <table class="submits">
    <thead>
      <tr>
        <th class="date">日時</th>
        <th class="user">ユーザ</th>
        <th class="task">問題</th>
        <th class="lang">言語</th>
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
        <td>{{ $getLanguage(item.lang).name }}</td>
        <td style="text-align: right; padding-right: 0.3em;">
          {{ item.point }}
        </td>
        <template
          v-if="item.executionTime !== null && item.executionMemory !== null"
        >
          <td>
            <div class="chip">
              <ResultChip :status="item.status" />
            </div>
          </td>
          <td style="text-align: right; padding-right: 0.3em;">
            {{ item.executionTime }} ms
          </td>
          <td style="text-align: right; padding-right: 0.3em;">
            {{ item.executionMemory || '---' }} KB
          </td>
        </template>
        <td v-else colspan="3">
          <div class="cell-result">
            <ResultChip :status="item.status" />
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
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import dayjs from 'dayjs'
import { Submit } from '~/types/submits'
import ResultChip from '~/components/submits/ResultChip.vue'
@Component({
  components: { ResultChip }
})
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
    width: auto;
  }
  th {
    padding: 0 0.3em;
  }
  td {
    padding: 0.3em 0.5em;
  }
  text-align: center;
  //.date {
  //  max-width: 11em;
  //}
  //$width-map: (
  //  user: 8em,
  //  task: 13em,
  //  lang: 10em,
  //  results: 6em,
  //  points: 5em,
  //  time: 7em,
  //  memory: 7em,
  //  detail: 4em
  //);
  //@each $class, $width in $width-map {
  //  .#{$class} {
  //    width: $width;
  //  }
  //}
  thead {
    background-color: #ffffe0;
  }
  tr:nth-child(even) {
    background-color: #eff4ff;
  }
  tbody td {
    height: 2.4em;
  }
  .cell-result {
    display: flex;
    width: 100%;
    justify-content: center;
  }
}
</style>
