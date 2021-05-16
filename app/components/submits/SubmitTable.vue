<template>
  <div>
    <v-row>
      <v-col cols="12" md="5" xl="3">
        <v-select
          v-model="filterTask"
          label="問題名"
          :items="taskItems"
          clearable
        />
      </v-col>
      <v-col cols="12" sm="8" md="4" xl="3">
        <v-combobox
          v-model="filterUser"
          label="ユーザ名"
          :items="userItems"
          clearable
        />
      </v-col>
      <v-col cols="12" sm="4" md="3" xl="2">
        <v-select
          v-model="filterStatus"
          label="結果"
          :items="statuses"
          clearable
        />
      </v-col>
    </v-row>
    <v-data-table
      :headers="headers"
      :items="submitData"
      :items-per-page="20"
      :footer-props="footerProps"
      multi-sort
      mobile-breakpoint="760"
    >
      <template v-slot:item.rejudge="{ item }">
        <v-simple-checkbox
          v-if="writtenTasks.includes(item.taskSlug)"
          :value="rejudgeIds.includes(item.id)"
          @input="(e) => changeRejudgeStatus(e, item)"
        />
      </template>
      <template v-slot:item.task="{ item }">
        <n-link :to="`/contests/${slug}/tasks/${item.taskSlug}`">{{
          item.task
        }}</n-link>
      </template>
      <template v-slot:item.status="{ item }">
        <ResultChip
          :status="item.status"
          :judge-status="item.judgeStatus"
          dense
        />
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon small class="cursor-pointer" @click="viewDetail(item)"
          >mdi-eye</v-icon
        >
      </template>
      <template v-slot:item.executionTime="{ item }">
        {{ item.executionTime }} ms
      </template>
      <template v-slot:item.executionMemory="{ item }">
        {{ item.executionMemory || '---' }} KB
      </template>
    </v-data-table>
    <div v-if="rejudgeIds.length">
      <v-btn color="orange lighten-3" @click="rejudge"
        >選択した提出 ({{ rejudgeIds.length }} 件) をリジャッジする</v-btn
      >
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import dayjs from 'dayjs'
import { DataTableHeader } from 'vuetify'
import { Submit, SubmitResult } from '~/types/submits'
import { Task } from '~/types/task'
import ResultChip from '~/components/submits/ResultChip.vue'
@Component({
  components: { ResultChip }
})
export default class SubmitTable extends Vue {
  @Prop()
  tasks?: Task[]

  @Prop({ required: true })
  submits!: Submit[]

  @Prop({ default: [] })
  writtenTasks!: string[]

  readonly statuses: SubmitResult[] = [
    'WJ',
    'AC',
    'WA',
    'TLE',
    'RE',
    'OLE',
    'IE',
    'CE',
    'MLE',
    'WR'
  ]

  footerProps = {
    itemsPerPageOptions: [10, 20, 50, 100, -1],
    showCurrentPage: true,
    showFirstLastPage: true
  }

  filterTask = ''
  filterUser: string | null = ''
  filterStatus = ''
  rejudgeIds: number[] = []

  get slug(): string {
    return this.$route.params.contestName
  }

  get headers() {
    const ret: DataTableHeader[] = [
      { text: '日時', value: 'date' },
      { text: 'ユーザ', value: 'user' },
      { text: '問題', value: 'task' },
      { text: '言語', value: 'lang' },
      { text: '得点', value: 'score', align: 'end' },
      { text: '結果', value: 'status', align: 'center' },
      { text: '実行時間', value: 'executionTime', align: 'end' },
      { text: 'メモリ', value: 'executionMemory', align: 'end' },
      { text: '', value: 'action' }
    ]
    if (this.writtenTasks.length) {
      ret.unshift({
        text: '',
        value: 'rejudge',
        sortable: false,
        divider: true
      })
    }
    return ret
  }

  get submitData() {
    return this.submits
      .filter(
        (item) =>
          item.user.name.includes(this.filterUser || '') &&
          (!this.filterTask || item.task.slug === this.filterTask) &&
          (!this.filterStatus || item.status === this.filterStatus)
      )
      .map((item) => ({
        id: item.id,
        taskSlug: item.task.slug,
        date: this.formatDate(item.timestamp),
        user: item.user.name,
        task: `${item.task.position}: ${item.task.name}`,
        lang: this.getLangName(item.lang),
        score: item.point,
        status: item.status,
        executionTime: item.executionTime,
        executionMemory: item.executionMemory,
        judgeStatus: item.judgeStatus
      }))
  }

  get taskItems() {
    return (
      this.tasks?.map((task) => ({
        value: task.slug,
        text: `${task.position} - ${task.name}`
      })) || []
    )
  }

  get userItems() {
    return this.submits.map((submission) => submission.user.name)
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

  changeRejudgeStatus(value: boolean, item: { id: number }) {
    if (value) this.rejudgeIds.splice(this.rejudgeIds.length, 0, item.id)
    else this.rejudgeIds = this.rejudgeIds.filter((x) => x !== item.id)
  }

  rejudge() {
    this.$emit('rejudge', this.rejudgeIds)
    this.rejudgeIds.splice(0, this.rejudgeIds.length)
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
