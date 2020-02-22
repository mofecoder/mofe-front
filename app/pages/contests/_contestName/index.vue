<template>
  <div>
    <ContestHeader :name="contestName" />
    <v-container class="pa-0" fluid>
      <ContestHeaderTab />
      <v-card>
        <v-card-title>{{ contestSlug }}</v-card-title>
      </v-card>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import ContestHeader from '~/components/ContestHeader.vue'
import ContestHeaderTab from '~/components/ContestHeaderTab.vue'
@Component({
  components: { ContestHeaderTab, ContestHeader }
})
export default class PageContest extends Vue {
  get contestSlug() {
    return this.$route.params.contestName
  }

  contestName: string = 'Tea Break 001'
}
</script>

<style scoped></style>
