<script setup lang="ts">
import ManageProblems from '~/utils/apis/ManageProblems'

const props = defineProps<{
  problemId: number
}>()

const { data: problem } = await useApi(ManageProblems.getProblem, [
  props.problemId
])
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
