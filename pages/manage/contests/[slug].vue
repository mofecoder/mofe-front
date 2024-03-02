<script setup lang="ts">
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import { FetchError } from 'ofetch'
import ManageContests from '~/utils/apis/ManageContests'
import type { ContestDetailManage } from '~/types/contest'
import { useUserStore } from '~/store/user'

definePageMeta({
  middleware: 'authenticated'
})

const userStore = useUserStore()

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

if (error.value?.status === 403) {
  await navigateTo('/')
}

const isAdmin = computed(() => userStore.isAdmin)

const usedPositions = computed(
  () => new Set(contestData.value?.tasks.map((x) => x.position))
)

if (!contestData.value) {
  throw createError({
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

const contest: Omit<ContestDetailManage, 'penaltyTime'> & {
  penaltyTime: string
} = reactive({
  ...contestData.value!,
  penaltyTime: contestData.value!.penaltyTime.toString()
})

const loading = reactive({
  information: false,
  time: false,
  tasks: false,
  add: false,
  admins: false
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
      officialMode: contest.officialMode,
      standingsMode: contest.standingsMode
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
  await http(ManageContests.removeTask.$path([contest.slug, slug]), {
    method: 'DELETE'
  })
  await reload()
  loading.tasks = false
}

const adminsError = ref('')
const addAdmin = async (user: string) => {
  loading.admins = true
  try {
    await http(ManageContests.addAdmin.$path([contest.slug]), {
      method: 'POST',
      body: { userName: user }
    })
    adminsError.value = ''
  } catch (error: unknown) {
    if (error instanceof FetchError && error?.data?.error) {
      adminsError.value = error.data.error
    } else {
      adminsError.value = 'コンテスト管理者の追加に失敗しました。'
    }
  } finally {
    await reload()
    loading.admins = false
  }
}

const removeAdmin = async (user: string) => {
  loading.admins = true
  try {
    await http(ManageContests.removeAdmin.$path([contest.slug]), {
      method: 'DELETE',
      body: { userName: user }
    })
  } catch (error: unknown) {
    alert('管理者の削除に失敗しました。')
  } finally {
    await reload()
    loading.admins = false
  }
}

const openModal = async () => {
  await reload()
  modal.value = true
}
</script>

<template>
  <v-container v-if="contestData" fluid>
    <div class="mb-3">
      <v-btn
        class="mr-2"
        to="/manage/contests"
        variant="tonal"
        color="purple"
        prepend-icon="mdi-arrow-left"
        >コンテスト一覧に戻る</v-btn
      >
      <v-btn
        class="mr-2"
        :to="`/contests/${contest.slug}`"
        variant="tonal"
        color="purple"
        prepend-icon="mdi-arrow-left"
        >コンテストページに戻る</v-btn
      >
    </div>
    <ManageContestsEditContestCard
      v-model:name="contest.name"
      v-model:penalty="contest.penaltyTime"
      v-model:description="contest.description"
      v-model:editorial-url="contest.editorial"
      v-model:kind="contest.kind"
      v-model:official-mode="contest.officialMode"
      v-model:standings-mode="contest.standingsMode"
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
      :is-admin="isAdmin"
      class="my-4"
      @add="openModal"
      @remove="remove"
    />
    <ManageContestsAddProblemCard
      v-if="isAdmin"
      class="my-4"
      :loading="loading.add"
      :used-positions="usedPositions"
      :unset-problems="unsetProblems || []"
      @add="addProblem"
    />
    <v-alert v-else type="info">
      <template #text>
        問題の追加・編集は管理者のみ可能ですのでお問い合わせください。
      </template>
    </v-alert>
    <ManageContestsAdminsCard
      v-if="isAdmin"
      :loading="loading.admins"
      :users="contest.admins"
      :error="adminsError"
      class="my-4"
      @add="addAdmin"
      @remove="removeAdmin"
    />
    <v-snackbar v-model="updated" :timeout="4000">
      コンテスト情報を更新しました。
    </v-snackbar>
  </v-container>
</template>

<style scoped lang="scss"></style>
