<script setup lang="ts">
import type { FilterOptions } from '~/utils/apis/Contests'
import Contests from '~/utils/apis/Contests'
import type { SortItem } from '~/types/datatable'

definePageMeta({
  layout: 'contest'
})

const { contest, contestName } = useContest()

useHead(() => ({
  title: `すべての提出 - ${contest.value!.name}`,
  titleTemplate: null
}))

const adminMode = ref(false)
const errorMessage = ref<string | null>(null)

const allowAdminMode = computed(() => !!contest.value?.writtenTasks.length)
const page = ref(1)
const count = ref(20)
const sortBy = ref<SortItem[]>([])
const filter = ref({
  task: [],
  user: '',
  status: []
} as FilterOptions)

const loading = ref<Boolean>(false)
const timeout = computed(() => (adminMode.value ? 2000 : 30000))

const args = reactive({
  slug: contestName,
  page,
  count,
  sortBy,
  filter
})
const { data: submissions, refresh } = await useApi(
  Contests.getAllSubmissions,
  args
)

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
        <v-card v-if="!errorMessage">
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
