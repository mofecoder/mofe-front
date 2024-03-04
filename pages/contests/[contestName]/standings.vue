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

const closedMode = ref(false)
const args = computed(
  () => [contestName.value, closedMode.value] as [string, boolean]
)
const {
  data: standingData,
  pending,
  refresh
} = await useApi(Contests.getStandings, args, {
  lazy: true
})
const problems = computed(() => standingData.value?.problems)
const standings = computed(() => standingData.value?.standings)
const teamPrefix = TEAM_CONTEST_LIST[contestName.value]
const refreshInterval = ref(-1)

useIntervalFn(async () => {
  await refresh()
}, refreshInterval)
</script>

<template>
  <div>
    <template v-if="contest">
      <v-card v-if="!standings" loading variant="flat">
        <v-card-title>順位表</v-card-title>
        <v-card-text>Loading...</v-card-text>
      </v-card>
      <template v-else>
        <ContestsStandingsTable
          v-model:closed-mode="closedMode"
          :loading="pending"
          :problems="problems"
          :standings="standings"
          :mode="contest.standingsMode"
          :team-prefix="teamPrefix"
          :exclude-open="
            contest.allowOpenRegistration && contest.registrationRestriction
          "
          @reload="refresh"
        />
      </template>
      <div v-if="contest.isAdmin" class="d-flex">
        <v-text-field
          v-model.number="refreshInterval"
          class="ma-4"
          type="number"
          label="リロード頻度 (秒)"
          min="-1"
          density="compact"
        />
      </div>
    </template>
  </div>
</template>

<style scoped></style>
