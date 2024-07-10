<script setup lang="ts">
import type { TestcaseSetResult } from '~/types/submissions'

const props = defineProps<{
  results: TestcaseSetResult[]
}>()

type Result = 'AC' | 'WA' | 'TLE' | 'MLE' | 'OLE' | 'RE'

const getResults = (results: TestcaseSetResult['results']) => {
  const res: [Result, number][] = []
  for (const status of [
    'ac',
    'wa',
    'tle',
    'mle',
    'ole',
    're',
    'qle'
  ] as const) {
    if (status in results) {
      res.push([status.toUpperCase() as Result, results[status]])
    }
  }
  return res
}
const getAcPercentage = (results: TestcaseSetResult['results']) => {
  const ac = results.ac || 0
  const all = Object.values(results).reduce((a, b) => a + b, 0)
  return (ac / all) * 100
}

const showName = computed(() =>
  props.results.some((set) => set.testcases != null)
)
const showNameList = reactive(new Set<string>())

const TESTCASE_SHOW_MAX = 10
</script>

<template>
  <v-table class="testcase-set-table">
    <thead>
      <tr>
        <th class="row-name">セット名</th>
        <th class="row-score">得点 / 配点</th>
        <th v-if="showName" rowspan="2" class="row-testcases">
          テストケース名
        </th>
      </tr>
      <tr>
        <th colspan="2" class="row-status">結果</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="(set, i) in results" :key="`testcase-set-${i}`">
        <tr>
          <td>{{ set.name }}</td>
          <td>{{ set.point }} / {{ set.score }}</td>
          <td v-if="showName" rowspan="2">
            <div class="testcases-wrapper">
              <template v-if="set.testcases!.length > TESTCASE_SHOW_MAX">
                <v-btn
                  v-if="showNameList.has(set.name)"
                  variant="tonal"
                  prepend-icon="mdi-eye-off"
                  density="comfortable"
                  @click="showNameList.delete(set.name)"
                >
                  非表示
                </v-btn>
                <v-btn
                  v-else
                  variant="tonal"
                  density="comfortable"
                  prepend-icon="mdi-eye"
                  @click="showNameList.add(set.name)"
                >
                  表示
                </v-btn>
              </template>
              <div
                v-show="
                  set.testcases!.length <= TESTCASE_SHOW_MAX ||
                  showNameList.has(set.name)
                "
                class="testcases"
              >
                {{ set.testcases.join(', ') }}
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td colspan="2">
            <div class="status-count-wrapper">
              <div
                v-for="[status, count] in getResults(set.results)"
                :key="status"
                class="status-count"
              >
                <ContestsSubmissionsResultChip
                  hide-icon
                  no-min-width
                  :status="status"
                  dense
                />
                <div>× {{ count }}</div>
              </div>
            </div>
            <v-progress-linear
              class="mt-1 mb-2"
              :model-value="getAcPercentage(set.results)"
              color="green"
              bg-color="yellow"
              bg-opacity="1"
            />
          </td>
        </tr>
      </template>
    </tbody>
  </v-table>
</template>

<style scoped lang="scss">
@import 'vuetify/lib/components/VTable/variables';

.testcase-set-table {
  th,
  td {
    text-align: center !important;
  }
  tr:nth-child(2n + 1) {
    td:nth-child(-n + 2) {
      border-bottom: none;
    }
  }
  tr:nth-last-child(2) {
    td:nth-child(3) {
      border-bottom: none;
    }
  }
}
.row-name {
  min-width: 90px;
  max-width: 200px;
}
.row-score {
  width: 120px;
}
.row-status {
  min-width: 110px;
}
.status-count-wrapper {
  display: flex;
  justify-content: space-evenly;
  flex-wrap: wrap;
  gap: 0 12px;
}
.status-count {
  display: flex;
  justify-content: center;
  align-items: center;
}
.testcases-wrapper {
  display: flex;
  padding: 8px 0;
  gap: 8px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.testcases {
  font-size: 0.9em;
}
</style>
