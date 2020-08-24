<template>
  <v-data-table
    :headers="headers"
    :items="submitData"
    :items-per-page="20"
    :footer-props="footerProps"
    multi-sort
    mobile-breakpoint="760"
  >
    <template v-slot:item.task="{ item }">
      <n-link :to="`/contests/${slug}/tasks/${item.taskSlug}`">{{
        item.task
      }}</n-link>
    </template>
    <template v-slot:item.status="{ item }">
      <ResultChip :status="item.status" dense />
    </template>
    <template v-slot:item.action="{ item }">
      <v-icon small class="cursor-pointer" @click="viewDetail(item)"
        >mdi-eye</v-icon
      >
    </template>
  </v-data-table>
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

  headers = [
    { text: '日時', value: 'date' },
    { text: 'ユーザ', value: 'user' },
    { text: '問題', value: 'task' },
    { text: '言語', value: 'lang' },
    { text: '得点', value: 'score', align: 'right' },
    { text: '結果', value: 'status', align: 'center' },
    { text: '実行時間', value: 'executionTime', align: 'right' },
    { text: 'メモリ', value: 'executionMemory', align: 'right' },
    { text: '', value: 'action' }
  ]

  footerProps = {
    itemsPerPageOptions: [10, 20, 50, 100, -1],
    showCurrentPage: true,
    showFirstLastPage: true
  }

  get slug(): string {
    return this.$route.params.contestName
  }

  get submitData() {
    return this.submits.map((item) => ({
      id: item.id,
      taskSlug: item.task.slug,
      date: this.formatDate(item.timestamp),
      user: item.user.name,
      task: `${item.task.position}: ${item.task.name}`,
      lang: this.getLangName(item.lang),
      score: item.point,
      status: item.status,
      executionTime:
        item.executionTime === null ? '' : `${item.executionTime} ms`,
      executionMemory:
        item.executionMemory === null
          ? ''
          : `${item.executionMemory || '---'} KB`
    }))
  }

  getLangName(langId: string) {
    const name = this.$getLanguage(langId)?.name
    if (!name) return ''
    return /^(.+?)(?: \(.+?\))?$/.exec(name)![1]
  }

  formatDate(date: Date): string {
    const dt = dayjs(date)
    return dt.year() === dayjs().year()
      ? dt.format('MM/DD HH:mm:ss')
      : dt.format('YYYY/MM/DD HH:mm:ss')
  }

  viewDetail({ id }: { id: number }) {
    this.$router.push({
      path: `/contests/${this.slug}/submits/${id}`
    })
  }
}
</script>

<style lang="scss" scoped>
.cursor-pointer {
  cursor: pointer;
}
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
