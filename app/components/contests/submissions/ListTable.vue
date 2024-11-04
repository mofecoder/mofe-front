<script setup lang="ts">
import type { Task } from '~/types/task'
import type { FilterOptions, SubmissionResponse } from '~/utils/apis'
import type { DataTableHeader, SortItem } from '~/types/datatable'
import { JUDGE_STATUSES } from '~/constants/judgeStatuses'

const emits = defineEmits<{
  refresh: [load: boolean]
  interval: []
  rejudge: [value: number[]]
  'update:page': [value: number]
  'update:count': [value: number]
  'update:sortBy': [value: SortItem[]]
  'update:filter': [value: FilterOptions]
}>()

const props = defineProps<{
  interval: number
  tasks?: Task[]
  writtenTasks?: unknown[]
  submissions: SubmissionResponse
  page: number
  count: number
  sortBy: SortItem[]
  filter: FilterOptions
  contestSlug: string
  loading: boolean
}>()

const footerProps = reactive({
  showCurrentPage: true,
  showFirstLastPage: true
})

const rejudgeIds: Set<number> = reactive(new Set())

const loadingInner = ref(false)

useIntervalFn(
  async () => {
    await reload()
  },
  () => props.interval
)

const headers = computed(() => {
  const ret: DataTableHeader[] = [
    { title: '日時', key: 'date' },
    { title: 'ユーザ', key: 'user' },
    { title: '問題', key: 'task' },
    { title: '言語', key: 'lang' },
    { title: '得点', key: 'score', align: 'end' },
    { title: '結果', key: 'status', align: 'center' },
    { title: '実行時間', key: 'executionTime', align: 'end' },
    { title: 'メモリ', key: 'executionMemory', align: 'end' },
    { title: '', key: 'action', sortable: false }
  ]
  if (props.writtenTasks?.length) {
    ret.unshift({
      title: '',
      key: 'rejudge',
      sortable: false
    })
  }
  return ret
})

const { $getLanguageName } = useNuxtApp()

const getLanguageName = (lang: string) => {
  const name = $getLanguageName(lang)?.name
  if (!name) return ''
  return /^(.+?)(?: \(.+?\))?$/.exec(name)![1]
}

const submissionsData = computed(() =>
  props.submissions.data.map((item) => ({
    id: item.id,
    taskSlug: item.task.slug,
    date: formatDate(item.timestamp),
    user: item.user.name,
    task: `${item.task.position}: ${item.task.name}`,
    lang: getLanguageName(item.lang),
    score: item.point,
    status: item.status,
    executionTime: item.executionTime,
    executionMemory: item.executionMemory,
    judgeStatus: item.judgeStatus
  }))
)

const taskItems = computed(() => {
  return (
    props.tasks?.map((task) => ({
      value: task.slug,
      title: `${task.position} - ${task.name}`
    })) || []
  )
})

const userItems = computed(() => {
  return Array.from(
    new Set(
      props.submissions?.data.map((submission) => submission.user.name) || []
    )
  )
})

async function reload() {
  emits('refresh', false)
}

function setRejudgeStatus(value: boolean, item: { id: number }) {
  if (value) rejudgeIds.add(item.id)
  else rejudgeIds.delete(item.id)
}

function rejudge() {
  emits('rejudge', Array.from(rejudgeIds))
  rejudgeIds.clear()
}

const filterTask = computed({
  get: () => props.filter.task,
  set: (value) => emits('update:filter', { ...props.filter, task: value })
})
const filterUser = computed({
  get: () => props.filter.user,
  set: (value) => emits('update:filter', { ...props.filter, user: value })
})
const filterStatus = computed({
  get: () => props.filter.status,
  set: (value) => emits('update:filter', { ...props.filter, status: value })
})
</script>

<template>
  <v-row>
    <v-col cols="12" md="5" xl="3">
      <v-select
        v-model="filterTask"
        label="問題名"
        :items="taskItems"
        clearable
        multiple
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
        :items="JUDGE_STATUSES as string[]"
        clearable
        multiple
      />
    </v-col>
  </v-row>
  <v-data-table-server
    :items-per-page="count"
    :headers="headers"
    :items="submissionsData"
    :items-length="submissions.meta.pagination.count"
    :items-per-page-options="[10, 20, 50, 100, 200]"
    :loading="loading || loadingInner"
    :footer-props="footerProps"
    density="compact"
    @update:sort-by="(s) => emits('update:sortBy', s)"
    @update:items-per-page="(cnt) => emits('update:count', cnt)"
    @update:page="(p) => emits('update:page', p)"
  >
    <template #item.task="{ item, index }">
      <NuxtLink
        class="text-decoration-none font-weight-medium"
        :to="`/contests/${contestSlug}/tasks/${submissionsData[index]!.taskSlug}`"
        >{{ item.task }}</NuxtLink
      >
    </template>
    <template #item.status="{ item, index }">
      <ContestsSubmissionsResultChip
        :status="item.status"
        :judge-status="submissionsData[index]!.judgeStatus"
        dense
      />
    </template>
    <template #item.action="{ index }">
      <v-btn
        density="compact"
        icon="mdi-eye"
        variant="text"
        :to="`/contests/${contestSlug}/submissions/${submissionsData[index]!.id}`"
      />
    </template>
    <template #item.executionTime="{ item }">
      {{ item.executionTime == null ? '' : `${item.executionTime} ms` }}
    </template>
    <template #item.executionMemory="{ item }">
      {{ item.executionMemory == null ? '' : `${item.executionMemory} KB` }}
    </template>
    <template #item.rejudge="{ index }">
      <v-checkbox-btn
        :model-value="rejudgeIds.has(submissionsData[index]!.id)"
        density="compact"
        @update:model-value="setRejudgeStatus($event, submissionsData[index]!)"
      />
    </template>
    <template #expanded-row> EXPANDED ROW </template>
  </v-data-table-server>
  <div v-if="rejudgeIds.size">
    <v-btn color="orange-lighten-3" @click="rejudge"
      >選択した提出 ({{ rejudgeIds.size }} 件) をリジャッジする</v-btn
    >
  </div>
</template>

<style lang="scss" scoped>
.cursor-pointer {
  cursor: pointer;
}
.submits {
  border-collapse: collapse;
  text-align: center;

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
