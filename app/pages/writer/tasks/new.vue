<template>
  <div class="new-task-page">
    <v-container fluid>
      <v-layout justify-center>
        <v-flex xl6 lg8 md10>
          <CreateProblemCard />
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import CreateProblemCard from '~/components/CreateProblemCard.vue'

@Component({ components: { CreateProblemCard } })
export default class PageWriterTaskNew extends Vue {
  onSubmit() {
    // API に投げる
  }
}
</script>

<style scoped>
.new-task-page {
}
</style>
