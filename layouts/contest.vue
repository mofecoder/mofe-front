<script lang="ts" setup>
import { ref } from 'vue'
import dayjs from 'dayjs'
import ContestSidebar from '~/components/ContestSidebar.vue'
import 'dayjs/locale/ja'
import { useContestStore } from '~/store/contest'
import { useUserStore } from '~/store/user'

const contestStore = useContestStore()
const userStore = useUserStore()
const route = useRoute()

const drawer = ref<boolean | null>(null)

const contest = computed(() => contestStore.contest)

const current = computed(() => {
  const path = route.fullPath
  const regex = /contests\/\w+(?:\/((\w*)[\w/]*?)\/?(?:\?.+)?)?$/.exec(path)
  if (!regex) return null
  return regex[1] || ''
})

const user = computed(() => {
  return userStore.getUser
})

const contestTime = computed(() => {
  dayjs.locale('ja')

  const start = dayjs(contest.value!.startAt)
  const end = dayjs(contest.value!.endAt)

  if (start.isSame(end, 'day')) {
    return [start.format('YYYY/MM/DD (dd) HH:mm') + ' - ' + end.format('HH:mm')]
  } else {
    return [
      start.format('YYYY/MM/DD (dd) HH:mm') + ' - ',
      end.format('YYYY/MM/DD (dd) HH:mm')
    ]
  }
})

const unreadClarifications = computed(() => {
  if (!contestStore.clarifications) return 0
  const key = `${contest.value!.slug}_clar`
  let read = localStorage.getItem(key)
  if (read == null) {
    read = dayjs().toISOString()
    localStorage.setItem(key, read)
  }
  return contestStore.clarifications.filter((clar) =>
    dayjs(clar.updatedAt).isAfter(read!)
  ).length
})

const routeContestName = computed(() => {
  const contestName = route.params.contestName
  return Array.isArray(contestName) ? contestName[0] ?? null : contestName
})
</script>

<template>
  <v-app>
    <v-sheet
      app
      flat
      width="100%"
      min-height="4rem"
      height="auto"
      color="green-darken-4"
      class="text-white pl-8 contest-header"
    >
      <v-app-bar-nav-icon
        class="d-md-none contest-header__nav-icon"
        @click.stop="drawer = !drawer"
      />
      <template v-if="contest">
        <NuxtLink class="contest-header__contest-name-link" to="/">
          {{ contest.name }}
        </NuxtLink>
        <div class="contest-header__info">
          <div class="contest-header__info__title">コンテスト日時</div>
          <div v-for="text in contestTime" :key="text" v-text="text" />
        </div>
      </template>
      <v-spacer />
      <template v-if="user">
        <NuxtLink class="contest-header__user-name pr-8 text-white" to="/user"
          >{{ user.name }}
        </NuxtLink>
      </template>
      <template v-else>
        <v-btn class="text-white" to="/sign_up" variant="text">新規登録</v-btn>
        <v-btn class="text-white" to="/login" variant="text">ログイン</v-btn>
      </template>
    </v-sheet>
    <v-navigation-drawer v-model="drawer" class="mt-16" mobile-breakpoint="960">
      <ContestSidebar
        v-if="contest"
        :contest="contest"
        :contest-name="routeContestName"
        :unread-clarifications="unreadClarifications"
      />
    </v-navigation-drawer>
    <v-main>
      <v-container>
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<style lang="scss">
.contest-header {
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  flex-wrap: wrap;
  z-index: 9999;

  &__nav-icon {
    color: white !important;
    margin-right: 1.5em;
  }

  &__contest-name-link {
    color: inherit !important;
    text-decoration: inherit !important;
  }

  &__user-name {
    color: white;
    font-size: 1.2rem;
    align-self: center;
    text-decoration: none;
  }

  &__info {
    margin-left: 2rem;
    font-size: 0.9rem;
    color: #eaeaea;

    &__title {
      font-size: 0.7rem;
    }
  }
}
</style>
