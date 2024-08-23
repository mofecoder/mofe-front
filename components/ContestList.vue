<script setup lang="ts">
import { formatDate } from '~/utils/formatting'
import type { Contest } from '~/types/contest'
import useApi from '~/composables/useApi'
import Contests from '~/utils/apis/Contests'

const dayjs = useDayjs()

const { data } = await useApi(Contests.getContests, [], {
  server: false
})

const contests = computed(() =>
  data.value
    ? data.value.inProgress.concat(data.value.future, data.value.past)
    : []
)

const checkStatus = (contest: Contest) => {
  const startAt = dayjs(contest.startAt)
  const endAt = dayjs(contest.endAt)

  if (startAt.isAfter(Date())) return 'future'
  if (endAt.isBefore(Date())) return 'ended'
  return 'ongoing'
}
</script>

<template>
  <v-container class="pa-0">
    <template v-if="contests">
      <v-list lines="two" nav density="comfortable">
        <v-list-subheader>コンテスト一覧（最新10件）</v-list-subheader>
        <v-list-item
          v-for="contest in contests.slice(0, 10)"
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
