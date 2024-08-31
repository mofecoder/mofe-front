<script setup lang="ts">
import type { Duration } from 'dayjs/plugin/duration'
import { definePageMeta } from '#imports'
import Contests from '~/utils/apis/Contests'
import type { Contest } from '~/types/contest'

definePageMeta({
  layout: 'top'
})

const { data } = await useApi(Contests.getContests, [])
const dayjs = useDayjs()

const formatDuration = (duration: Duration) => {
  const hours = Math.floor(duration.asHours())
  const minutes = duration.minutes()
  if (minutes === 0) return `${hours}時間`
  return `${hours}時間${('00' + minutes).slice(-2)}分`
}

const transform = (value: Contest[] | undefined) => {
  if (!value) return []
  return value.map((contest) => {
    const start = dayjs(contest.startAt)
    const end = dayjs(contest.endAt)
    const duration = dayjs.duration(end.diff(start))
    return {
      title: contest.name,
      props: {
        to: `/contests/${contest.slug}`,
        subtitle:
          `${formatDate(start, false)} - ` +
          `${formatDate(end, false)} (${formatDuration(duration)})`
      }
    }
  })
}
</script>

<template>
  <v-container>
    <v-row>
      <v-col cols="12" lg="6">
        <h4>開催中のコンテスト</h4>
        <v-list
          nav
          lines="two"
          density="compact"
          :items="transform(data?.inProgress)"
        />
        <h4>常設コンテスト</h4>
        <v-list
          nav
          lines="two"
          density="compact"
          :items="transform(data?.permanent)"
        />
        <h4>予定されたコンテスト</h4>
        <v-list
          nav
          lines="two"
          density="compact"
          :items="transform(data?.future)"
        />
      </v-col>
      <v-col cols="12" lg="6">
        <h4>過去のコンテスト</h4>
        <v-list
          nav
          lines="two"
          density="compact"
          :items="transform(data?.past)"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped lang="scss"></style>
