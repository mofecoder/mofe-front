<template>
  <v-card class="wrapper">
    <v-card-title>問題の一覧</v-card-title>
    <v-card-text>
      <contest-admin-problems-card-table-header />
      <contest-admin-problems-card-table />
      <v-btn color="primary" block class="my-3">問題を追加する</v-btn>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import ContestAdminProblemsCardTableHeader from '~/components/ContestAdminProblemsCardTableHeader.vue'
import ContestAdminProblemsCardTable from '~/components/ContestAdminProblemsCardTable.vue'
@Component({
  components: {
    ContestAdminProblemsCardTableHeader,
    ContestAdminProblemsCardTable
  }
})
export default class ContestAdminProblemsCard extends Vue {}
</script>

<style scoped>
.wrapper {
}
</style>
