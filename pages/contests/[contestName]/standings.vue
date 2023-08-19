<script lang="ts" setup>
import Contests from '~/utils/apis/Contests'
import { TEAM_CONTEST_LIST } from '~/constants/teamContestList'

definePageMeta({
  layout: 'contest'
})

const { contest, contestName } = useContest()

useHead(() => ({
  title: `順位表 - ${contest.value?.name}`,
  titleTemplate: null
}))

const {
  data: standingData,
  pending,
  refresh
} = await useApi(Contests.getStandings, [contestName.value], {
  lazy: true
})
const problems = computed(() => standingData.value?.problems)
const standings = computed(() => standingData.value?.standings)
const teamPrefix = TEAM_CONTEST_LIST[contestName.value]
const timeout = ref(-1)
const refreshInterval = ref(-1)

function resetInterval(value: number) {
  if (!process.client) return

  window.clearInterval(timeout.value)
  if (value != -1) {
    timeout.value = window.setInterval(async () => {
      await refresh()
    }, value * 1000)
  }
}
watch(refreshInterval, (interval) => resetInterval(interval))
onBeforeUnmount(() => window.clearInterval(timeout.value))
</script>

<template>
  <div>
    <template v-if="contest">
      <v-card v-if="!standings" loading>
        <v-card-title>順位表</v-card-title>
        <v-card-text>Loading...</v-card-text>
      </v-card>
      <template v-else>
        <ContestsStandingsTable
          :loading="pending"
          :problems="problems"
          :standings="standings"
          :mode="contest.standingsMode"
          :team-prefix="teamPrefix"
          @reload="refresh"
        />
      </template>
      <v-text-field
        v-if="contest.isAdmin"
        v-model.number="refreshInterval"
        class="ma-4"
        type="number"
        label="リロード頻度 (秒)"
        min="-1"
        density="compact"
      />
    </template>
  </div>
</template>

<style scoped></style>
