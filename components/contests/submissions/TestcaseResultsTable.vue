<script setup lang="ts">
import { TestcaseResult } from '~/types/submissions'

const props = defineProps<{
  testcaseResults: TestcaseResult[]
  sampleCount: number | null
}>()

const isHidden = computed(() =>
  props.testcaseResults.every((result) => result.testcaseName === null)
)

const getTestcaseName = (index: number): string => {
  if (!isHidden.value) return props.testcaseResults[index].testcaseName!
  if (index < props.sampleCount!) {
    return 'サンプル'
  } else {
    return `テストケース`
  }
}
</script>

<template>
  <v-table>
    <thead>
      <tr>
        <th>テストケース名</th>
        <th>結果</th>
        <th>実行時間</th>
        <th>メモリ使用量</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(result, i) in testcaseResults" :key="`testcase-result-${i}`">
        <td v-text="getTestcaseName(i)" />
        <td>
          <ContestsSubmissionsResultChip :status="result.status" dense />
        </td>
        <td>{{ result.executionTime }} ms</td>
        <td>{{ result.executionMemory || '---' }} KB</td>
      </tr>
    </tbody>
  </v-table>
</template>

<style scoped lang="scss"></style>
