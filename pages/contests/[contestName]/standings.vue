<script lang="ts" setup>
import Contests from '~/utils/apis/Contests'

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
</script>

<template>
  <div>
    <template v-if="contest">
      <v-container class="pa-0" fluid>
        <v-card v-if="pending" loading>
          <v-card-title>順位表</v-card-title>
          <v-card-text>Loading...</v-card-text>
        </v-card>
        <ContestsStandingsTable
          v-else
          :problems="problems"
          :standings="standings"
          :mode="contest.standingsMode"
          @reload="refresh"
        />
      </v-container>
    </template>
  </div>
</template>

<style scoped></style>
