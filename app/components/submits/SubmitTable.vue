<template>
  <table class="submits">
    <thead>
      <tr>
        <th class="time">日時</th>
        <th class="user">ユーザ</th>
        <th class="task">問題</th>
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
        <template v-if="item.executionTime && item.memory">
          <td>
            <span :class="`result-${item.result}`">{{ item.result }}</span>
          </td>
          <td>{{ item.executionTime }} ms</td>
          <td>{{ item.memory }} KB</td>
        </template>
        <td v-else rowspan="3">
          <span :class="`result-${item.result}`">{{ item.result }}</span>
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
  .time {
    width: 16em;
    min-width: 11em;
  }
  .user {
    width: 8em;
  }
  .task {
    width: 16em;
  }
  .results {
    width: 4em;
  }
  .time {
    width: 7em;
  }
  .memory {
    width: 7em;
  }
  .detail {
    width: 4em;
  }
  tbody:nth-child(even) {
    background-color: #fffff8;
  }
}
</style>
