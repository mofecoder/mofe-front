<script setup lang="ts">
import type { LocationQueryValue } from 'vue-router'
import type { FilterOptions } from '~/utils/apis/Contests'
import Contests from '~/utils/apis/Contests'
import type { SortItem } from '~/types/datatable'
import { JUDGE_STATUSES } from '~/constants/judgeStatuses'

definePageMeta({
  layout: 'contest'
})

const { contest, contestName } = useContest()
const router = useRouter()
const route = useRoute()

useHead(() => ({
  title: `すべての提出 - ${contest.value?.name}`,
  titleTemplate: null
}))

function toArray(value: LocationQueryValue | LocationQueryValue[]): string[] {
  if (Array.isArray(value)) {
    return value.filter((x) => x !== null) as string[]
  } else if (value) {
    return [value]
  } else {
    return []
  }
}

const adminMode = ref(false)
const errorMessage = ref<string | null>(null)

const allowAdminMode = computed(() => !!contest.value?.writtenTasks.length)
const page = ref(
  typeof route.query.page === 'string' ? parseInt(route.query.page) : 1
)
const count = ref(
  typeof route.query.count === 'string' ? parseInt(route.query.count) : 20
)
const sortBy = ref<SortItem[]>([])
const tasks = computed(
  () => new Set(contest.value?.tasks?.map((x) => x.slug) || [])
)

const statuses: string[] = JUDGE_STATUSES

const filter = ref({
  task: toArray(route.query.task).filter(
    (t) => t && tasks.value.has(t)
  ) as string[],
  user: '',
  status: toArray(route.query.status).filter((t) => t && statuses.includes(t))
} as FilterOptions)

if (typeof route.query.user === 'string') {
  filter.value.user = route.query.user
}

watch(
  filter,
  (value) => {
    const query = { ...route.query }
    if (value.task.length) {
      query.task = value.task
    } else {
      delete query.task
    }
    query.user = value.user
    if (!query.user) delete query.user
    if (value.status.length) {
      query.status = value.status
    } else {
      delete query.status
    }
    router.replace({ query })
  },
  { deep: true }
)
watch(page, (value) => {
  router.replace({ query: { ...route.query, page: value } })
})
watch(count, (value) => {
  router.replace({ query: { ...route.query, count: value } })
})

const loading = ref<boolean>(false)
const timeout = computed(() => (adminMode.value ? 2000 : 30000))

const args = reactive({
  slug: contestName,
  page,
  count,
  sortBy,
  filter
})
const {
  data: submissions,
  refresh,
  apiLoading
} = await useApi(Contests.getAllSubmissions, args, { lazy: true })

async function rejudge(submissionIds: number[]) {
  await useApi(
    Contests.rejudge,
    [unref(contestName)],
    {},
    {
      submissionIds
    }
  )
  await refresh()
}

async function reload(load: boolean) {
  if (load) return
  loading.value = load
  await refresh().then(() => {
    loading.value = false
  })
}
const writtenTaskList = computed(() => contest.value?.writtenTasks ?? [])
</script>
<template>
  <div>
    <template v-if="contest">
      <v-container class="pa-0" fluid>
        <v-card v-if="!errorMessage" :loading="apiLoading">
          <v-card-title>すべての提出</v-card-title>
          <v-card-text class="submit-card">
            <v-switch
              v-if="allowAdminMode"
              v-model="adminMode"
              color="orange"
              label="高頻度更新（2 秒）を有効にする"
            />
            <ContestsSubmissionsListTable
              v-if="submissions"
              v-model:page="page"
              v-model:count="count"
              v-model:sort-by="sortBy"
              v-model:filter="filter"
              :interval="timeout"
              :submissions="submissions"
              :tasks="contest.tasks"
              :written-tasks="writtenTaskList"
              :contest-slug="contestName"
              :loading="loading"
              @rejudge="rejudge"
              @refresh="reload"
            />
          </v-card-text>
        </v-card>
        <v-alert v-else type="error" icon="mdi-alert">
          {{ errorMessage }}
        </v-alert>
      </v-container>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.submit-card {
  //@include card-text-reset();
}
</style>
