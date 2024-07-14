<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { FetchError } from 'ofetch'
import { useUserStore } from '~/store/user'
import Contests from '~/utils/apis/Contests'

const route = useRoute()
const dayjs = useDayjs()

definePageMeta({
  layout: 'contest'
})

const { contest, updateContest } = useContest()

useHead(() => ({
  title: contest.value?.name
}))

const userStore = useUserStore()

const penaltyTime = computed(() => {
  const pena = contest.value?.penaltyTime
  if (!pena) return 'なし'
  return pena % 60
    ? `${Math.ceil(pena / 60)} 分 ${pena % 60} 秒`
    : `${pena / 60} 分`
})

const subtitle = computed(() => {
  const penalty = `ペナルティ：${penaltyTime.value}`
  if (contest.value?.kind === 'private')
    return `プライベートコンテスト / ${penalty}`
  return penalty
})

const contestEnded = computed(() => {
  return dayjs(contest.value?.endAt).isBefore(dayjs())
})

const isAdmin = computed(() => {
  return contest.value?.isAdmin || false
})

const isWriter = computed(() =>
  contest.value ? contest.value.writtenTasks.length > 0 : null
)

const contestSlug = computed(() => contest.value?.slug)

const router = useRouter()

const registerLoading = ref(false)

const message = ref<{
  title: string
  text: string
  color: 'error' | 'success' | 'warning' | 'info'
} | null>(null)

const unregister = async () => {
  try {
    const res = await http<{ message: string | null }>(
      Contests.unregister.$path([contestSlug.value!]),
      { method: 'DELETE' }
    )
    const messageRes = res?.message
    message.value = {
      title: '参加登録を取り消しました',
      text: messageRes ?? '',
      color: messageRes ? 'info' : 'success'
    }
  } catch (error) {
    console.error(error)
    const text = error instanceof FetchError ? error?.data?.error : ''
    message.value = {
      title: '参加登録の取り消しに失敗しました',
      text,
      color: 'error'
    }
    registerLoading.value = false
    return
  }

  await updateContest()
}

const registerInner = async (isTeam: boolean, body: Record<string, any>) => {
  if (!storeToRefs(userStore).user.value) {
    await router.push({
      path: '/auth/signin',
      query: { redirect: route.path }
    })
    return
  }

  registerLoading.value = true
  let response = ''
  try {
    if (isTeam) {
      response = await http(Contests.teamRegister.$path([contestSlug.value!]), {
        method: 'POST',
        body
      })
    } else {
      response = await http(Contests.register.$path([contestSlug.value!]), {
        method: 'POST',
        body
      })
    }
  } catch (error) {
    const text = error instanceof FetchError ? error?.data?.error : ''
    message.value = {
      title: '参加登録に失敗しました',
      text,
      color: 'error'
    }
    registerLoading.value = false
    return
  }
  const messageRes = typeof response === 'object' ? response['message'] : ''
  message.value = {
    title: '参加登録しました',
    text: messageRes,
    color: messageRes ? 'warning' : 'success'
  }
  await updateContest()
  registerLoading.value = false
}

const register = async (password?: string, open?: boolean) => {
  await registerInner(false, { password, open })
}

const teamRegister = async (
  name: string,
  passphrase: string,
  password?: string,
  open?: boolean
) => {
  await registerInner(true, { name, passphrase, password, open })
}
</script>

<template>
  <v-card flat :loading="!contest">
    <v-alert
      v-if="message"
      variant="tonal"
      :type="message.color"
      density="comfortable"
      class="mb-4"
    >
      <template #title>{{ message.title }}</template>
      {{ message.text }}
    </v-alert>
    <template v-if="contest">
      <v-card-title>
        {{ contest.name }}
      </v-card-title>
      <v-card-subtitle>{{ subtitle }}</v-card-subtitle>
      <v-card-text class="contest-card">
        <template v-if="contestEnded || isWriter || isAdmin" />
        <ContestsRegisterForm
          v-else
          class="mb-6"
          :allow-open="contest.allowOpenRegistration"
          :registered="contest.registered"
          :allow-team="contest.allowTeamRegistration"
          :restriction="contest.registrationRestriction"
          :loading="registerLoading"
          @individual="register"
          @team="teamRegister"
          @unregister="unregister"
        />
        <v-btn
          v-if="isAdmin"
          color="purple white--text"
          class="mb-4"
          :to="`/manage/contests/${contestSlug}`"
          prepend-icon="mdi-application-edit"
          >コンテストの編集画面へ</v-btn
        >
        <MarkdownContent
          class="contest-card__description"
          :markdown="contest.description"
        />
      </v-card-text>
    </template>
  </v-card>
</template>

<style scoped lang="scss">
@import 'styles/markdown';
.contest-card__description {
  @include markdown();
}
</style>
