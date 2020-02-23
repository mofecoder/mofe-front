<template>
  <div>
    <ContestHeader :name="contestName" />
    <v-container class="pa-0" fluid>
      <ContestHeaderTab />
      <v-card>
        <Standings />
      </v-card>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import ContestHeader from '~/components/ContestHeader.vue'
import ContestHeaderTab from '~/components/ContestHeaderTab.vue'
import Standings from '~/components/standings/Standings.vue'
@Component({
  components: { Standings, ContestHeaderTab, ContestHeader }
})
export default class PageContestStandings extends Vue {
  get contestSlug() {
    return this.$route.params.contestName
  }

  contestName: string = 'Tea Break 001'
}
</script>

<style scoped></style>
