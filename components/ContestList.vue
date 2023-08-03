<script setup lang="ts">
import { formatDate } from '~/utils/formatting'
import { Contest } from '~/types/contest'
import dayjs from 'dayjs'
import useApi from '~/composables/useApi'
import Contests from '~/utils/apis/Contests'

const { data: contests } = await useApi(Contests.getContests, [])
const checkStatus = (contest: Contest) => {
  const startAt = dayjs(contest.startAt)
  const endAt = dayjs(contest.endAt)

  if (startAt.isAfter(Date())) return '予　定'
  if (endAt.isBefore(Date())) return '終　了'
  return '開催中'
}
</script>

<template>
  <v-table>
    <thead>
      <tr>
        <th style="width: 7em" />
        <th style="width: 9.5em">開始日時</th>
        <th>コンテスト名</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="contest in contests || []" :key="contest.slug">
        <td v-text="checkStatus(contest)" />
        <td v-text="formatDate(contest.startAt, false)" />
        <td>
          <NuxtLink :to="`contests/${contest.slug}`">
            {{ contest.name }}
          </NuxtLink>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<style scoped lang="scss"></style>
