<script setup lang="ts">
import type { ProblemType } from '~/components/manage/contests/ProblemCardTable.vue'

defineProps<{
  tasks?: ProblemType[]
  contestSlug: string
}>()
defineEmits<{
  remove: [string]
}>()
</script>

<template>
  <v-card>
    <v-card-title>問題一覧</v-card-title>
    <v-card-text>
      <ManageContestsProblemCardTable
        :contest-slug="contestSlug"
        :tasks="tasks"
        @remove="$emit('remove', $event)"
      />
    </v-card-text>
  </v-card>
</template>

<style scoped lang="scss"></style>
