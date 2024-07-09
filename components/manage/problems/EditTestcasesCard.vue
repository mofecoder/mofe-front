<script setup lang="ts">
import ManageProblems from '~/utils/apis/ManageProblems'
import AggregateTypes from '~/constants/aggregateTypes'
import type { AggregateType, Testcase, TestcaseSet } from '~/types/problems'

const props = defineProps<{
  problemId: number
}>()

const file = ref<File | null>(null)
const messages = ref<string[]>([])
const ok = ref<boolean | null>(null)
const testcaseDialog = ref<boolean>(false)
const testcaseId = ref<number | null>(null)
const testcaseSetDialog = ref<boolean>(false)
const testcaseLoading = ref<boolean>(false)
const editingTestcaseSetId = ref<number | null>(null)
const uploadLoading = ref<boolean>(false)
const updateCompleteSnackbar = ref<boolean>(false)

const testcaseNames = computed(() => testcases.value?.map((x) => x.name) || [])
const testcaseSetNames = computed(
  () => testcaseSets.value?.map((x) => x.name) || []
)

const { data, refresh: refreshTestcase } = await useApi(
  ManageProblems.getTestcases,
  [props.problemId]
)
const testcases = computed(() => data.value?.testcases || [])
const testcaseSets = computed<TestcaseSet[]>(
  () => data.value?.testcaseSets || []
)

const change = (f: File) => {
  file.value = f || null
}

const uploadZip = async () => {
  if (!file.value) return
  uploadLoading.value = true
  const form = new FormData()
  form.append('file', file.value)
  const { data, error } = await useApi(
    ManageProblems.uploadTestcases,
    [props.problemId],
    {
      signal: AbortSignal.timeout(1200 * 1000),
      retry: false
    },
    form
  )
  uploadLoading.value = false
  if (error.value) {
    messages.value = [error.value.data?.error]
    ok.value = false
    return
  }
  if (data.value) {
    messages.value = data.value.messages
    ok.value = true
    file.value = null
    testcaseLoading.value = true
    await refreshTestcase()
    testcaseLoading.value = false
  }
}

const updateTestcase = async (params: {
  name: string
  input: string
  output: string
  explanation: string | null
}) => {
  await useApi(
    ManageProblems.updateTestcase,
    [props.problemId, testcaseId.value!],
    {},
    params
  )
  await refreshTestcase()
  testcaseDialog.value = false
  updateCompleteSnackbar.value = true
}

const deleteTestcase = async (id: number) => {
  testcaseLoading.value = true
  await useApi(ManageProblems.deleteTestcase, [props.problemId, id])
  await refreshTestcase()
  testcaseLoading.value = false
}

const createTestcase = async (params: {
  name: string
  input: string
  output: string
  explanation: string | null
}) => {
  await useApi(ManageProblems.createTestcase, [props.problemId], {}, params)
  await refreshTestcase()
  testcaseDialog.value = false
}

const saveSet = async (params: {
  name: string
  points: string
  aggregateType: AggregateType
}) => {
  if (Number.isNaN(Number(params.points))) return
  let err
  const create = editingTestcaseSetId.value == null
  if (create) {
    const { error } = await useApi(
      ManageProblems.createTestcaseSet,
      [props.problemId],
      {},
      params
    )
    err = error
  } else {
    const { error } = await useApi(
      ManageProblems.updateTestcaseSet,
      [props.problemId, editingTestcaseSetId.value!],
      {},
      params
    )
    err = error
  }
  if (err.value?.statusCode === 400) {
    alert(
      `テストケースセットの${create ? '追加' : '更新'}に失敗しました: ${
        err.value.data?.error
      }`
    )
  }
  await refreshTestcase()
  testcaseSetDialog.value = false
}

const selecting = reactive(new Set<number>())

const addingPattern = ref<string>()
const addingSet = ref<number>()
const addingTarget = ref<Testcase[] | null>()

const addingHint = computed<[boolean, string]>(() => {
  if (addingTarget.value === null) return [true, '正規表現が誤っています']
  if (addingTarget.value === undefined) return [false, '']
  if (addingTarget.value.length === 0) return [false, '対象なし']
  return [false, `対象: ${addingTarget.value.map((x) => x.name).join(', ')}`]
})

const selectingHeader = (value: boolean) => {
  if (value) {
    testcases.value.forEach((x) => selecting.add(x.id))
  } else {
    selecting.clear()
  }
}

const deleteAll = async () => {
  testcaseLoading.value = true
  await http(ManageProblems.deleteMultipleTestcases.$path([props.problemId]), {
    method: 'DELETE',
    body: { testcases: Array.from(selecting) }
  })
  selecting.clear()
  await refreshTestcase()
  testcaseLoading.value = false
}

const addSet = () => {
  editSet(null)
}

const editSet = (id: number | null) => {
  editingTestcaseSetId.value = id
  testcaseSetDialog.value = true
}

const deleteSet = async (id: number) => {
  try {
    await http(ManageProblems.deleteTestcaseSet.$path([props.problemId, id]))
  } catch (error) {
    alert('テストケースセットの削除に失敗しました。')
    return
  }
  await refreshTestcase()
}

const changeTestcaseState = async (i: number, j: number, v: boolean) => {
  if (!testcaseSets.value) return
  testcaseLoading.value = true
  await http(
    ManageProblems.changeTestcaseState.$path([
      props.problemId,
      testcases.value![i].id
    ]),
    {
      method: 'PATCH',
      body: {
        testcaseSetId: testcaseSets.value[j].id,
        state: v
      }
    }
  )
  await refreshTestcase()
  testcaseLoading.value = false
}

const viewTestcase = (id: number) => {
  testcaseId.value = id
  testcaseDialog.value = true
}

const closeModal = () => {
  testcaseId.value = null
  testcaseDialog.value = false
}

const closeSetModal = () => {
  editingTestcaseSetId.value = null
  testcaseSetDialog.value = false
}

const updateAddingTarget = () => {
  if (!addingPattern.value) {
    addingTarget.value = undefined
    return
  }
  try {
    const regex = RegExp(addingPattern.value)
    const res = []
    for (const testcase of testcases.value) {
      if (regex.test(testcase.name)) {
        res.push(testcase)
      }
    }
    addingTarget.value = res
  } catch (ex) {
    if (ex instanceof SyntaxError) {
      addingTarget.value = null
    }
  }
}

const addSetMultiple = async () => {
  if (addingSet.value === undefined || !addingTarget.value) return
  await http(ManageProblems.addToTestcaseSetMultiple.$path([props.problemId]), {
    method: 'PATCH',
    body: {
      testcaseIds: addingTarget.value.map((x) => x.id),
      testcaseSetId: addingSet.value
    }
  })
  addingPattern.value = undefined
  addingSet.value = undefined
  updateAddingTarget()
  await refreshTestcase()
}
</script>

<template>
  <v-container class="testcase">
    <v-alert
      title="採点の仕組み"
      type="info"
      variant="tonal"
      class="mb-8"
      closable
    >
      集計方法が「通常」の場合、「テストケースセット」に含まれるすべてのテストケースがACとなった場合、
      そのテストケースセットの配点が加算されます（特殊な集計方法については「ジャッジ」タブを参照）。<br />
      満点はすべてのテストケースセットの配点の合計となります。<br />
      採点順・表示順はテストケース名の辞書順です。
    </v-alert>
    <v-card class="mb-8" variant="outlined" :loading="!testcaseSets">
      <v-card-title>テストケースセット一覧</v-card-title>
      <v-card-text class="set-list">
        <v-table v-if="testcaseSets">
          <thead>
            <tr>
              <th class="text-center">テストケースセット名</th>
              <th class="text-center">集計方法</th>
              <th class="text-center">配点</th>
              <th class="text-center">サンプル</th>
              <th />
            </tr>
          </thead>
          <tbody>
            <tr v-for="set in testcaseSets" :key="set.name">
              <td v-text="set.name" />
              <td
                class="text-center"
                v-text="
                  AggregateTypes.find((x) => x.value === set.aggregateType)!
                    .text
                "
              />
              <td class="text-right">
                {{ set.points }}
                <span v-if="set.aggregateType !== 'all'" class="text-caption">
                  (表示のみ)
                </span>
              </td>
              <td class="text-center">
                {{ set.isSample ? 'Yes' : 'No' }}
              </td>
              <td>
                <v-btn
                  icon="mdi-pencil"
                  size="small"
                  variant="text"
                  @click="editSet(set.id)"
                />
                <v-btn
                  v-if="!['all', 'sample'].includes(set.name)"
                  icon="mdi-delete"
                  size="small"
                  variant="text"
                  @click="deleteSet(set.id)"
                />
              </td>
            </tr>
          </tbody>
        </v-table>
        <v-btn color="primary" prepend-icon="mdi-tab-plus" @click="addSet"
          >テストケースセットを追加</v-btn
        >
      </v-card-text>
    </v-card>
    <v-card
      class="mb-8"
      variant="outlined"
      :loading="!testcases || testcaseLoading"
    >
      <v-card-title>テストケース一覧</v-card-title>
      <v-card-text class="testcase-list">
        <v-table v-if="testcases" density="compact" class="testcases-table">
          <thead>
            <tr>
              <th>
                <v-checkbox-btn
                  :model-value="selecting.size === testcases.length"
                  :indeterminate="
                    selecting.size > 0 && selecting.size < testcases.length
                  "
                  color="red"
                  hide-details
                  @update:model-value="selectingHeader"
                />
              </th>
              <th class="testcase-list__row-testcase-name">テストケース名</th>
              <th
                v-for="set in testcaseSets"
                :key="set.name"
                class="testcase-list__row-set testcase-set-col"
                v-text="set.name"
              />
              <th class="testcase-list__row-action" />
            </tr>
          </thead>
          <tbody>
            <tr v-for="(testcase, i) in testcases" :key="testcase.name">
              <td>
                <v-checkbox-btn
                  :model-value="selecting.has(testcase.id)"
                  hide-details
                  color="red"
                  @update:model-value="
                    $event
                      ? selecting.add(testcase.id)
                      : selecting.delete(testcase.id)
                  "
                />
              </td>
              <td v-text="testcase.name" />
              <td
                v-for="(_, j) in testcase.testcaseSets"
                :key="`${testcase.name}_${j}`"
                class="testcase-set-col"
              >
                <v-checkbox-btn
                  class="mt-0"
                  :model-value="testcases[i].testcaseSets[j]"
                  color="orange"
                  hide-details
                  @update:model-value="
                    (v) => changeTestcaseState(i as number, j as number, v)
                  "
                />
              </td>
              <td>
                <v-btn
                  icon="mdi-pencil"
                  density="compact"
                  :disabled="testcaseLoading"
                  variant="text"
                  size="small"
                  @click="viewTestcase(testcase.id)"
                />
                <v-btn
                  icon="mdi-delete"
                  density="compact"
                  :disabled="testcaseLoading"
                  variant="text"
                  size="small"
                  @click="deleteTestcase(testcase.id)"
                />
              </td>
            </tr>
          </tbody>
        </v-table>
        <div class="d-flex my-2 flex-wrap">
          <v-btn
            color="primary"
            prepend-icon="mdi-plus"
            @click.stop="testcaseDialog = true"
          >
            テストケースを追加
          </v-btn>
          <v-btn
            color="red"
            variant="tonal"
            :disabled="selecting.size == 0"
            prepend-icon="mdi-delete-alert"
            class="ms-4"
            @click="deleteAll"
          >
            選択したテストケース ({{ selecting.size }} 件) をすべて削除
          </v-btn>
        </div>
        <p class="mt-4">
          正規表現を入力してテストケースセットを選択すると、
          マッチするすべてのテストケースがテストケースセットに追加されます。
        </p>
        <div class="my-2 flex-wrap">
          <v-text-field
            v-model="addingPattern"
            label="正規表現パターン"
            placeholder="sample-\d+"
            density="compact"
            persistent-hint
            :error-messages="addingHint[0] ? [addingHint[1]] : null"
            :hint="addingHint[1]"
            @update:model-value="updateAddingTarget"
          />
          <v-select
            v-model="addingSet"
            class="mt-2"
            label="一括追加するテストケースセットを選択"
            :disabled="addingHint[0] || !addingTarget"
            :items="testcaseSets"
            item-title="name"
            item-value="id"
            density="compact"
            @update:model-value="addSetMultiple"
          />
        </div>
      </v-card-text>
    </v-card>
    <v-card variant="outlined" :loading="uploadLoading">
      <v-card-title>テストケースをアップロードする</v-card-title>
      <v-card-text>
        <v-expansion-panels class="mb-8">
          <ManageProblemsTestcaseUploadExpansionPanel />
        </v-expansion-panels>
        <v-form @submit.prevent="uploadZip">
          <v-file-input
            label="アップロードするファイル"
            placeholder="ZIPファイルを選択"
            prepend-icon="mdi-folder-zip"
            accept=".zip"
            @change="change($event.target.files[0] || null)"
          />
          <v-btn
            type="submit"
            color="primary"
            prepend-icon="mdi-folder-upload"
            block
            :disabled="!file || uploadLoading"
            >アップロードする</v-btn
          >
        </v-form>
        <div v-if="ok != null" class="testcase__result mt-8">
          <div
            class="testcase__result__status mb-2"
            :class="{ ok: ok, ng: !ok }"
          >
            テストケースのアップロードに{{ ok ? '成功' : '失敗' }}しました
          </div>
          <ul v-if="messages">
            <li v-for="item in messages" :key="item" v-text="item" />
          </ul>
        </div>
      </v-card-text>
    </v-card>
    <LazyManageProblemsEditTestcaseModal
      :value="testcaseDialog"
      :problem-id="problemId"
      :testcase-id="testcaseId"
      :testcase-names="testcaseNames"
      @close="closeModal"
      @create="createTestcase"
      @update="updateTestcase"
    />
    <LazyManageProblemsEditTestcaseSetModal
      v-model:id="editingTestcaseSetId"
      :value="testcaseSetDialog"
      :problem-id="problemId"
      :testcase-set-names="testcaseSetNames"
      @save="saveSet"
      @close="closeSetModal"
    />
    <v-snackbar v-model="updateCompleteSnackbar" color="success">
      テストケースを更新しました
    </v-snackbar>
  </v-container>
</template>

<style scoped lang="scss">
.testcases-table {
  .testcase-set-col {
    text-align: center;

    > div {
      justify-content: center;
    }
  }
}
</style>
