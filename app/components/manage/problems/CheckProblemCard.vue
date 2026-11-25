<script setup lang="ts">
import { manageProblemsApi } from '~/utils/apis'

const props = defineProps<{
  problemId: number
}>()

const manageProblemsRepo = manageProblemsApi()
const { data: problem } = await useAsyncData(
  () => `manage:problem:${props.problemId}`,
  () => manageProblemsRepo.get(props.problemId)
)
</script>

<template>
  <div class="ma-4">
    <ProblemsViewProblemCard
      v-if="problem"
      :id="problem.id"
      :problem="problem"
    />
  </div>
</template>

<style scoped lang="scss"></style>
