<script setup lang="ts">
import type { Dayjs } from 'dayjs'
import { manageContestsApi, manageProblemsApi } from '~/utils/apis'
import type { ContestDetailManage } from '~/types/contest'
import { useUserStore } from '~/store/user'
import type { ProblemType } from '~/components/manage/contests/ProblemCardTable.vue'

definePageMeta({
  middleware: 'authenticated'
})

const userStore = useUserStore()
const dayjs = useDayjs()

const route = useRoute()
const modal = ref(false)
const slug = computed(() =>
  Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug
)
const manageContestsRepo = manageContestsApi()
const manageProblemsRepo = manageProblemsApi()
const {
  data: contestData,
  error,
  refresh: refreshContest
} = await useAsyncData(
  () => `manage:contest:${slug.value}`,
  () => manageContestsRepo.get(slug.value!)
)
const { data: unsetProblems, refresh: refreshUnsetProblems } =
  await useAsyncData('manage:unset-problems', () =>
    manageProblemsRepo.unsetProblems()
  )

if (getErrorStatus(error.value) === 403) {
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
  await manageContestsRepo.update(slug.value!, {
      name: contest.name,
      kind: contest.kind,
      penaltyTime: Number(contest.penaltyTime),
      description: contest.description,
      editorialUrl: contest.editorial || undefined,
      officialMode: contest.officialMode,
      standingsMode: contest.standingsMode,
      allowTeamRegistration: contest.allowTeamRegistration,
      allowOpenRegistration: contest.allowOpenRegistration,
      closedPassword: contest.closedPassword
  })
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
  await manageContestsRepo.update(slug.value!, {
    startAt: dayjs(contest.startAt).format(),
    endAt: dayjs(contest.endAt).format()
  })
  updated.value = true
  await reload()
  loading.time = false
}

const addProblem = async (problemId: number, pos: string) => {
  loading.add = true
  await manageContestsRepo.addTask(slug.value!, {
    problemId,
    problemSlug: `${slug.value}_${pos.toLowerCase()}`,
    position: pos
  })
  await reload()
  loading.add = false
}

const remove = async (slug: string) => {
  loading.tasks = true
  await manageContestsRepo.removeTask({ slug: contest.slug, taskSlug: slug })
  await reload()
  loading.tasks = false
  editingProblem.value = null
}

// 編集中の問題 (null なら「問題を追加」カードは追加モード)
const editingProblem = ref<ProblemType | null>(null)
const addProblemCard = useTemplateRef('addProblemCard')

// API は id を返すが Task 型には無いので ProblemType として扱う
const tasks = computed(() => contest.tasks as ProblemType[])

const startEdit = (id: number) => {
  editingProblem.value = tasks.value.find((t) => t.id === id) ?? null
  if (!editingProblem.value) return
  addProblemCard.value?.$el?.scrollIntoView({ behavior: 'smooth' })
}

const moveProblem = async (taskSlug: string, pos: string) => {
  loading.add = true
  try {
    await manageContestsRepo.moveTask({ slug: contest.slug, taskSlug }, pos)
    await reload()
    editingProblem.value = null
  } catch (e) {
    alert(getErrorMessage(e, '問題の位置の変更に失敗しました。'))
  } finally {
    loading.add = false
  }
}

const adminsError = ref<string[]>([])
const addAdmin = async (users: string[]) => {
  loading.admins = true
  try {
    const result = await manageContestsRepo.addAdmins(contest.slug, {
      userNames: users
    })
    adminsError.value = result.errors.map(
      ({ userName, error }) => `${userName}: ${error}`
    )
  } catch (error: unknown) {
    adminsError.value = [
      getErrorMessage(error, 'コンテスト管理者の追加に失敗しました。')
    ]
  } finally {
    await reload()
    loading.admins = false
  }
}

const removeAdmin = async (user: string) => {
  loading.admins = true
  try {
    await manageContestsRepo.removeAdmin(contest.slug, { userName: user })
  } catch {
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
      v-model:allow-open-registration="contest.allowOpenRegistration"
      v-model:allow-team-registration="contest.allowTeamRegistration"
      v-model:closed-password="contest.closedPassword"
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
      @edit="startEdit"
    />
    <v-alert type="info" variant="tonal">
      <template #text>
        コンテスト管理者の追加、他のユーザの問題の追加は管理者のみ可能ですのでお問い合わせください。
      </template>
    </v-alert>
    <ManageContestsAddProblemCard
      ref="addProblemCard"
      class="my-4"
      :loading="loading.add"
      :used-positions="usedPositions"
      :unset-problems="unsetProblems || []"
      :tasks="tasks"
      :editing-problem="editingProblem"
      @add="addProblem"
      @move="moveProblem"
      @remove="remove"
      @cancel-edit="editingProblem = null"
    />
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
