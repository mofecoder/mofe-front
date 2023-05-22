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
import CreateProblemCard from '../../../comp/writer/CreateProblemCard.vue'

@Component({
  components: { CreateProblemCard },
  middleware: 'authenticated',
  head: { title: '問題の作成' }
})
export default class PageWriterProblemNew extends Vue {}
</script>

<style scoped>
.new-task-page {
}
</style>
