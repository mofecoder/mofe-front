<script lang="ts" setup>
import { ref } from 'vue'
import dayjs from 'dayjs'
import ContestSidebar from '~/components/contests/ContestSidebar.vue'
import 'dayjs/locale/ja'
import { useContestStore } from '~/store/contest'
import { useUserStore } from '~/store/user'
import { storeToRefs } from 'pinia'
import { useDisplay } from 'vuetify'

const contestStore = useContestStore()
const userStore = useUserStore()
const drawer = ref<boolean | null>(null)

const { contest, contestName, updateContest } = useContest()
await updateContest()

const { user } = storeToRefs(userStore)

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
  if (!contestStore.clarifications || !process.client) return 0
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
const { lgAndUp: desktop } = useDisplay()
const route = useRoute()
const createLink = (path: string) => ({
  path,
  query: {
    ...route.query,
    redirect: route.path.startsWith('/auth') ? undefined : route.path
  }
})
</script>

<template>
  <v-app>
    <v-app-bar color="green-darken-4" class="text-white pl-4 contest-header">
      <template #prepend>
        <v-app-bar-nav-icon
          variant="text"
          class="d-lg-none contest-header__nav-icon"
          @click.stop="drawer = !drawer"
        >
          <v-icon icon="mdi-menu" />
        </v-app-bar-nav-icon>
      </template>
      <template v-if="contest">
        <v-btn icon="mdi-home" to="/" />
        <v-app-bar-title>
          {{ contest.name }}
        </v-app-bar-title>
        <div class="contest-header__info">
          <div class="contest-header__info__title">コンテスト日時</div>
          <div v-for="text in contestTime" :key="text" v-text="text" />
        </div>
      </template>
      <v-spacer />
      <ClientOnly>
        <template v-if="user">
          <v-btn
            variant="text"
            prepend-icon="mdi-account"
            class="text-none"
            to="/user"
          >
            {{ user.name }}
          </v-btn>
        </template>
        <template v-else>
          <v-btn
            class="text-white"
            :to="createLink('/auth/signup')"
            prepend-icon="mdi-account-plus"
            variant="text"
            >新規登録</v-btn
          >
          <v-btn
            class="text-white"
            :to="createLink('/auth/signin')"
            variant="text"
            prepend-icon="mdi-login-variant"
            >ログイン</v-btn
          >
        </template>
      </ClientOnly>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" :rail="desktop" expand-on-hover>
      <ContestSidebar
        v-if="contest && contestName"
        :contest="contest"
        :contest-name="contestName"
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

  &__contest-name-link {
    padding-left: 24px;
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