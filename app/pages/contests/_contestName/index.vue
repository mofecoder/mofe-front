<template>
  <div>
    <ContestHeader :name="contestName" />
    <v-container class="pa-0" fluid>
      <ContestHeaderTab />
      <v-card>
        <v-card-title>{{ contestSlug }}</v-card-title>
        <v-card-text style="color:inherit"> </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import ContestHeader from '~/components/ContestHeader.vue'
import ContestHeaderTab from '~/components/ContestHeaderTab.vue'
import MathJax from '~/mixins/mathjax'
@Component({
  components: { ContestHeaderTab, ContestHeader }
})
export default class PageContest extends mixins(MathJax) {
  get contestSlug() {
    return this.$route.params.contestName
  }

  contestName: string = 'Tea Break 001'
}
</script>

<style scoped></style>
