<script lang="ts" setup>
import { ref } from 'vue'
import { useDisplay } from 'vuetify'
import 'dayjs/locale/ja'
import { useContestStore } from '~/store/contest'
import { useUserStore } from '~/store/user'

const contestStore = useContestStore()
const userStore = useUserStore()
const dayjs = useDayjs()
dayjs.locale('ja')
const drawer = ref<boolean | null>(null)

const { contest, contestName, updateContest } = useContest(true)
await updateContest()

const { user } = storeToRefs(userStore)

const contestTime = computed(() => {
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

const unreadClarifications = computed<number>((oldValue) => {
  if (!contest.value) {
    return oldValue || 0
  }
  if (!contestStore.clarifications || !import.meta.client) {
    return 0
  }
  const key = `${contest.value.slug}_clar`
  let read = localStorage.getItem(key)
  if (read == null) {
    read = dayjs().toISOString()
    localStorage.setItem(key, read)
  }
  return contestStore.clarifications.filter((clar) =>
    dayjs(clar.updatedAt).isAfter(read!)
  ).length
})

const newClarifications = ref(false)
watch(unreadClarifications, (value, oldValue) => {
  if (oldValue < value) {
    newClarifications.value = true
  }
  if (value === 0) {
    newClarifications.value = false
  }
})

const { lgAndUp: desktop } = useDisplay()
const opened = ref(['Problems'])
const role = computed(() => {
  if (!user.value || !contest.value) return ''
  if (user.value.role === 'admin') return 'Admin'
  if (contest.value.isAdmin) return 'Manager'
  if (contest.value.isWriterOrTester) return 'W/T'
  if (contest.value.registered) return 'Contestant'
  return ''
})
</script>

<template>
  <v-app>
    <nuxt-loading-indicator />
    <v-app-bar color="light-green-lighten-4" class="contest-header" flat>
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
        <v-app-bar-title class="d-none d-md-inline contest-header__title">
          {{ contest.name }}
        </v-app-bar-title>
        <EnvironmentChip class="ml-4 mr-2" />
        <div class="contest-header__info md-1 ml-md-4">
          <div class="contest-header__info__title">コンテスト日時</div>
          <div v-for="text in contestTime" :key="text" v-text="text" />
        </div>
      </template>
      <v-spacer />
      <template #append>
        <ToolbarUser :role="role" />
      </template>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      :rail="desktop"
      expand-on-hover
      width="350"
    >
      <ContestsContestSidebar
        v-if="contest && contestName"
        v-model:opened="opened"
        :contest="contest"
        :contest-name="contestName"
        :unread-clarifications="unreadClarifications"
      />
    </v-navigation-drawer>
    <v-main style="--v-layout-top: 64px">
      <v-container>
        <slot />
        <v-snackbar
          v-model="newClarifications"
          location="bottom right"
          color="info"
          :timeout="-1"
          close-on-back
          close-on-content-click
        >
          質問が更新されました！
        </v-snackbar>
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

  &__title {
    flex-grow: 0;
    min-width: auto;
  }

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
    font-size: 0.9rem;

    &__title {
      font-size: 0.7rem;
    }
  }
}
</style>
