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
// const standingData = null
// const refresh = () => ({})
</script>

<template>
  <div>
    <template v-if="contest">
      <v-container class="pa-0" fluid>
        <div v-if="pending">Loading...</div>
        <ContestsStandingsTable
          v-else
          :problems="standingData!.problems"
          :standings="standingData!.standings"
          @reload="refresh"
        />
      </v-container>
    </template>
  </div>
</template>

<style scoped></style>
