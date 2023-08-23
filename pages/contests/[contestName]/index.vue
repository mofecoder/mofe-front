<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import dayjs from 'dayjs'
import { useUserStore } from '~/store/user'
import { MarkdownIt } from '~/types/plugins'
import Contests from '~/utils/apis/Contests'

const route = useRoute()

definePageMeta({
  layout: 'contest'
})

const { contest } = useContest()

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

const register = async () => {
  if (!storeToRefs(userStore).user.value) {
    await router.push({
      path: '/auth/signin',
      query: { redirect: route.path }
    })
    return
  }
  await useApi(Contests.register, [contestSlug.value!])
}

const nuxtApp = useNuxtApp()
const $md: MarkdownIt = nuxtApp.$md
</script>

<template>
  <v-card :loading="!contest">
    <template v-if="contest">
      <v-card-title>
        {{ contest.name }}
      </v-card-title>
      <v-card-subtitle>{{ subtitle }}</v-card-subtitle>
      <v-card-text class="contest-card">
        <template v-if="contestEnded || isWriter || isAdmin" />
        <v-btn
          v-else-if="contest.registered"
          color="blue-darken-1"
          disabled
          class="mb-4 mr-6"
          >参加登録済み</v-btn
        >
        <v-btn v-else color="primary" class="mb-4" @click="register"
          >参加登録</v-btn
        >
        <v-btn
          v-if="isAdmin"
          color="purple white--text"
          :to="`/manage/contests/${contestSlug}`"
          density="compact"
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
