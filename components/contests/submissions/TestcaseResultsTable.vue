<script setup lang="ts">
import type { TestcaseResult } from '~/types/submissions'

const props = defineProps<{
  testcaseResults: TestcaseResult[]
  sampleCount: number | null
}>()

const isHidden = computed(() =>
  props.testcaseResults.every((result) => result.testcaseName === null)
)

const isAdmin = props.testcaseResults.some((x) => x.score !== undefined)

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
  <v-table class="table" density="compact">
    <thead>
      <tr>
        <th>テストケース名</th>
        <th>結果</th>
        <th v-if="isAdmin" class="text-gray">採点</th>
        <th>実行時間</th>
        <th>メモリ使用量</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(result, i) in testcaseResults" :key="`testcase-result-${i}`">
        <td v-text="getTestcaseName(i)" />
        <td class="row-result">
          <ContestsSubmissionsResultChip
            :status="result.status"
            dense
            no-min-width
          />
        </td>
        <td v-if="isAdmin" class="row-score">{{ result.score }}</td>
        <td class="row-time">{{ result.executionTime }} ms</td>
        <td class="row-memory">{{ result.executionMemory || '---' }} KB</td>
      </tr>
    </tbody>
  </v-table>
</template>

<style scoped lang="scss">
.table th {
  text-align: center !important;
}
.row-result {
  min-width: 100px;
}
.row-memory,
.row-time,
.row-score {
  text-align: end;
}
.row-score {
  font-size: 0.9em;
}
.row-time {
  min-width: 90px;
}
.row-memory {
  min-width: 120px;
}
</style>
