<script setup lang="ts">
import { definePageMeta } from '#imports'

definePageMeta({
  middleware: 'authenticated'
})

useHead(() => ({
  title: `問題の作成`
}))
</script>

<template>
  <v-container>
    <v-btn class="mb-3" to="/manage/problems" variant="text" color="purple">
      問題一覧に戻る
    </v-btn>
    <v-card>
      <ManageProblemsNewProblemCard />
    </v-card>
  </v-container>
</template>
<style scoped lang="scss"></style>
