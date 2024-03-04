<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useUserStore } from '~/store/user'
import type { MarkdownIt } from '~/types/plugins'
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

const password = ref('')
const registerLoading = ref('')

const message = ref<{
  title: string
  text: string
  color: 'error' | 'success'
} | null>(null)

const unregister = async () => {
  const { error } = await useApi(Contests.unregister, [contestSlug.value!])

  if (error.value) {
    message.value = {
      title: '参加登録の取り消しに失敗しました',
      text: error.value?.data?.error,
      color: 'error'
    }
  } else {
    message.value = {
      title: '参加登録を取り消しました',
      text: '',
      color: 'success'
    }
  }
  await updateContest()
}

const register = async (open: boolean) => {
  if (!storeToRefs(userStore).user.value) {
    await router.push({
      path: '/auth/signin',
      query: { redirect: route.path }
    })
    return
  }

  registerLoading.value = open ? 'open' : 'normal'

  const { error } = await useApi(
    Contests.register,
    [contestSlug.value!],
    {},
    {
      password: open ? undefined : password.value,
      open
    }
  )

  if (error.value) {
    message.value = {
      title: '参加登録に失敗しました',
      text: error.value?.data?.error,
      color: 'error'
    }
  } else {
    message.value = {
      title: '参加登録しました',
      text: '',
      color: 'success'
    }
    password.value = ''
  }
  await updateContest()
  registerLoading.value = ''
}

const nuxtApp = useNuxtApp()
const $md: MarkdownIt = nuxtApp.$md
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
        <div v-else-if="contest.registered" class="mb-4 py-4">
          <v-btn color="blue-darken-1" disabled class="mr-6">
            {{ contest.registered === 'open' ? 'オープン' : '' }}参加登録済み
          </v-btn>
          <v-btn color="red" @click="unregister">参加登録を取り消す</v-btn>
        </div>
        <v-container v-else class="px-0" fluid>
          <v-row>
            <v-col
              v-if="contest.registrationRestriction"
              cols="12"
              sm="10"
              md="5"
              xl="3"
            >
              <v-text-field
                v-model="password"
                variant="underlined"
                density="comfortable"
                label="参加登録パスワード"
                class="mb-4 mr-6"
                prepend-icon="mdi-lock"
              />
            </v-col>
            <v-col cols="6" sm="5" md="4" lg="2">
              <v-btn
                block
                color="primary"
                :loading="registerLoading === 'normal'"
                :disabled="
                  !!registerLoading ||
                  (contest.registrationRestriction && !password)
                "
                @click="register(false)"
                >参加登録</v-btn
              >
            </v-col>
            <v-col
              v-if="contest.allowOpenRegistration"
              cols="6"
              sm="5"
              md="3"
              lg="2"
            >
              <v-btn
                block
                color="secondary"
                :loading="registerLoading === 'open'"
                :disabled="!!registerLoading"
                @click="register(true)"
              >
                オープン参加登録
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
        <v-btn
          v-if="isAdmin"
          color="purple white--text"
          class="mb-4"
          :to="`/manage/contests/${contestSlug}`"
          prepend-icon="mdi-application-edit"
          >コンテストの編集画面へ</v-btn
        >
        <div
          class="contest-card__description"
          v-html="$md.render(contest.description)"
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
