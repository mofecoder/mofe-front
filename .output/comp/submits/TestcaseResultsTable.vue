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
          <ResultChip :status="result.status" dense />
        </td>
        <td>{{ result.executionTime }} ms</td>
        <td>{{ result.executionMemory || '---' }} KB</td>
      </tr>
    </tbody>
  </v-table>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { TestcaseResult } from '~/types/submits'
import ResultChip from '../../comp/submits/ResultChip.vue'
@Component({
  components: { ResultChip }
})
export default class TestcaseResultsTable extends Vue {
  @Prop({ required: true })
  testcaseResults!: TestcaseResult[]

  @Prop()
  sampleCount!: number

  getTestcaseName(i: number) {
    if (!this.isHidden) return this.testcaseResults[i].testcaseName
    return i < this.sampleCount
      ? 'テストケース名非公開 (サンプル)'
      : 'テストケース名非公開'
  }

  get isHidden() {
    return this.testcaseResults.every((result) => result.testcaseName === null)
  }
}
</script>

<style scoped lang="scss"></style>
