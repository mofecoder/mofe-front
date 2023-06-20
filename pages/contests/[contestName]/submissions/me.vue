<script setup lang="ts">
import Contests, { FilterOptions } from '~/utils/apis/Contests'
import { SortItem } from '~/types/datatable'

definePageMeta({
  layout: 'contest',
  middleware: 'authenticated'
})

const { contest, contestName } = useContest()

useHead({
  title: `自分の提出 - ${contest.value!.name}`,
  titleTemplate: null
})

const errorMessage = ref<string | null>(null)

const page = ref(1)
const count = ref(20)
const sortBy = ref<SortItem[]>([])
const filter = ref({
  task: [],
  user: '',
  status: []
} as FilterOptions)
const loading = ref<Boolean>(false)
const timeout = ref(15000)

const args = reactive({
  slug: contestName,
  page,
  count,
  sortBy,
  filter
})
const { data: submissions, refresh } = await useApi(
  Contests.getMySubmissions,
  args
).then((res) => {
  if (res.data.value) {
    timeout.value = res.data.value.data.some(
      (s) => s.judgeStatus || ['WJ', 'WR', 'IC'].includes(s.status)
    )
      ? 2000
      : 15000
  }
  return res
})

// TODO: Rejudge
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
          <v-card-title>自分の提出</v-card-title>
          <v-card-text class="submit-card">
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
