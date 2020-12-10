<template>
  <div>
    <template v-if="contest">
      <v-container class="pa-0" fluid>
        <Standings
          v-if="standingData"
          :problems="standingData.problems"
          :standings="standingData.standings"
          @reload="$fetch"
        />
        <div v-else>Loading...</div>
      </v-container>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import ContestHeader from '~/components/ContestHeader.vue'
import ContestHeaderTab from '~/components/ContestHeaderTab.vue'
import Standings from '~/components/standings/Standings.vue'
import MixinContest from '~/mixins/contest'
import { StandingData } from '~/types/standings'

@Component({
  components: { Standings, ContestHeaderTab, ContestHeader },
  layout: 'contest'
})
export default class PageContestStandings extends mixins(MixinContest) {
  head() {
    return {
      title: `順位表 - ${this.contest?.name}`,
      titleTemplate: null
    }
  }

  async fetch() {
    await this.getContest()
    await this.$api.Contests.standings(this.$route.params.contestName).then(
      (res) => {
        this.standingData = res
      }
    )
  }

  standingData: StandingData | null = null
}
</script>

<style scoped></style>
