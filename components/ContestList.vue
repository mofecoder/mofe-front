<script setup lang="ts">
import { formatDate } from '~/utils/formatting'
import type { Contest } from '~/types/contest'
import useApi from '~/composables/useApi'
import Contests from '~/utils/apis/Contests'

const dayjs = useDayjs()

const { data: contests } = await useApi(Contests.getContests, [], {
  server: false
})

const showFew = ref(true)

const checkStatus = (contest: Contest) => {
  const startAt = dayjs(contest.startAt)
  const endAt = dayjs(contest.endAt)

  if (startAt.isAfter(Date())) return 'future'
  if (endAt.isBefore(Date())) return 'ended'
  return 'ongoing'
}

const contestsData = computed(() => {
  if (!contests.value) return []
  if (showFew.value) return contests.value.slice(0, 10)
  return contests.value
})
</script>

<template>
  <v-container class="pa-0">
    <template v-if="contests">
      <v-list lines="two" nav density="comfortable">
        <v-list-item
          v-for="contest in contestsData"
          :key="contest.slug"
          :to="`/contests/${contest.slug}`"
        >
          <template #title>
            {{ contest.name }}
          </template>
          <template #subtitle>
            {{ formatDate(contest.startAt, false) }} -
            {{ formatDate(contest.endAt, false) }}
          </template>
          <template #prepend>
            <v-avatar
              v-if="checkStatus(contest) === 'ongoing'"
              color="green"
              variant="tonal"
              size="large"
              tile
            >
              開催中
            </v-avatar>
            <v-avatar
              v-else-if="checkStatus(contest) === 'future'"
              color="cyan"
              variant="tonal"
              size="large"
              tile
            >
              予定
            </v-avatar>
            <v-avatar v-else color="gray" variant="tonal" size="large" tile>
              終了
            </v-avatar>
          </template>
        </v-list-item>
      </v-list>
      <v-btn
        v-if="showFew && contests.length > 10"
        prepend-icon="mdi-chevron-down"
        color="primary"
        variant="text"
        @click="showFew = false"
      >
        すべて表示
      </v-btn>
      <v-btn
        v-else
        prepend-icon="mdi-chevron-up"
        color="primary"
        variant="text"
        @click="showFew = true"
      >
        最新 10 件のみ表示
      </v-btn>
    </template>
    <template v-else>
      <v-list lines="two">
        <v-skeleton-loader
          v-for="i in 10"
          :key="i"
          type="list-item-avatar-two-line"
        />
      </v-list>
    </template>
  </v-container>
</template>

<style scoped lang="scss"></style>
