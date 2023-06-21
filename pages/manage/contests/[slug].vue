<script setup lang="ts">
import ManageContests from '~/utils/apis/ManageContests'
import dayjs, { Dayjs } from 'dayjs'
import { ContestDetailManage } from '~/types/contest'

definePageMeta({
  middleware: 'admin'
})

const route = useRoute()
const modal = ref(false)
const slug = computed(() =>
  Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug
)
const {
  data: contestData,
  error,
  refresh: refreshContest
} = await useApi(ManageContests.getContest, [slug.value])
const { data: unsetProblems, refresh: refreshUnsetProblems } = await useApi(
  ManageContests.getUnsetProblems,
  []
)
const usedPositions = computed(
  () => new Set(contestData.value?.tasks.map((x) => x.position))
)

if (!contestData.value) {
  createError({
    statusCode: error.value?.statusCode,
    message: error.value?.message
  })
}

watch(contestData, (value, oldValue) => {
  if (!value) return
  Object.keys(value).forEach((ke) => {
    const key = ke as keyof ContestDetailManage
    if (!oldValue || value[key] !== oldValue[key]) {
      if (key === 'penaltyTime') {
        contest[key] = value[key].toString()
      } else {
        ;(contest as any)[key] = value[key]
      }
    }
  })
})

const contest = reactive({
  ...contestData.value!,
  penaltyTime: contestData.value!.penaltyTime.toString()
})

const loading = reactive({
  information: false,
  time: false,
  tasks: false,
  add: false
})

const updated = ref(false)

useHead(() => ({
  title: `[${contest.name}] コンテストの編集`
}))

const reload = async () =>
  await Promise.all([refreshContest(), refreshUnsetProblems()])

const editInformation = async () => {
  if (!contest) return
  loading.information = true
  await useApi(
    ManageContests.updateContest,
    [slug.value],
    {},
    {
      name: contest.name,
      kind: contest.kind,
      penaltyTime: Number(contest.penaltyTime),
      description: contest.description,
      editorialUrl: contest.editorial || undefined,
      officialMode: contest.officialMode
    }
  )
  updated.value = true
  await reload()
  loading.information = false
}

const timeRange = computed({
  get: () => [dayjs(contest.startAt), dayjs(contest.endAt)] as [Dayjs, Dayjs],
  set: (value) => {
    contest.startAt = value[0].format()
    contest.endAt = value[1].format()
  }
})

const editTime = async () => {
  if (!contest) return
  loading.time = true
  await useApi(
    ManageContests.updateContest,
    [slug.value],
    {},
    {
      startAt: dayjs(contest.startAt).format(),
      endAt: dayjs(contest.endAt).format()
    }
  )
  updated.value = true
  await reload()
  loading.time = false
}

const addProblem = async (problemId: number, pos: string) => {
  loading.add = true
  await useApi(ManageContests.addTask, [
    slug.value,
    problemId,
    `${slug.value}_${pos.toLowerCase()}`,
    pos
  ])
  await reload()
  loading.add = false
}

const remove = async (slug: string) => {
  loading.tasks = true
  await useApi(ManageContests.removeTask, [contest.slug, slug])
  await reload()
  loading.tasks = false
}

const openModal = async () => {
  await reload()
  modal.value = true
}
</script>

<template>
  <v-container v-if="contestData" fluid>
    <v-btn class="mb-3" to="/manage/contests" variant="text" color="purple"
      >コンテスト一覧に戻る</v-btn
    >
    <ManageContestsEditContestCard
      v-model:name="contest.name"
      v-model:penalty="contest.penaltyTime"
      v-model:description="contest.description"
      v-model:editorial-url="contest.editorial"
      v-model:kind="contest.kind"
      v-model:official-mode="contest.officialMode"
      :slug="contest.slug"
      :loading="loading.information"
      edit
      @submit="editInformation"
    />
    <ManageContestsTimeRangePickerCard
      v-model="timeRange"
      class="my-4"
      :loading="loading.time"
      edit-button
      @submit="editTime"
    />
    <ManageContestsProblemListCard
      :tasks="contest.tasks"
      :loading="loading.tasks"
      :contest-slug="contest.slug"
      class="my-4"
      @add="openModal"
      @remove="remove"
    />
    <ManageContestsAddProblemCard
      :loading="loading.add"
      :used-positions="usedPositions"
      :unset-problems="unsetProblems || []"
      @add="addProblem"
    />
    <v-snackbar v-model="updated" :timeout="4000">
      コンテスト情報を更新しました。
    </v-snackbar>
  </v-container>
</template>

<style scoped lang="scss"></style>
