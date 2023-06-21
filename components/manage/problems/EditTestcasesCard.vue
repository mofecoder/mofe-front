<script setup lang="ts">
import ManageProblems from '~/utils/apis/ManageProblems'

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

const testcaseNames = computed(() => testcases.value?.map((x) => x.name) || [])
const testcaseSetNames = computed(
  () => testcaseSets.value?.map((x) => x.name) || []
)

const { data, refresh: refreshTestcase } = await useApi(
  ManageProblems.getTestcases,
  [props.problemId]
)
const testcases = computed(() => data.value?.testcases || [])
const testcaseSets = computed(() => data.value?.testcaseSets || [])

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
  }
}

const updateTestcase = async (params: {
  name: string
  input: string
  output: string
  explanation: string
}) => {
  await useApi(
    ManageProblems.updateTestcase,
    [props.problemId, testcaseId.value!],
    {},
    params
  )
  await refreshTestcase()
  testcaseDialog.value = false
}

const deleteTestcase = async (id: number) => {
  testcaseLoading.value = true
  await useApi(ManageProblems.deleteTestcase, [props.problemId, id])
}

const createTestcase = async (params: {
  name: string
  input: string
  output: string
  explanation: string
}) => {
  await useApi(ManageProblems.createTestcase, [props.problemId], {}, params)
  await refreshTestcase()
  testcaseDialog.value = false
}

const saveSet = async (params: { name: string; points: string }) => {
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

const addSet = () => {
  editSet(null)
}

const editSet = (id: number | null) => {
  editingTestcaseSetId.value = id
  testcaseSetDialog.value = true
}

const deleteSet = async (id: number) => {
  const { error } = await useApi(ManageProblems.deleteTestcaseSet, [
    props.problemId,
    id
  ])
  if (error.value) {
    alert('テストケースセットの削除に失敗しました。')
    return
  }
  await refreshTestcase()
}

const changeTestcaseState = (i: number, j: number, v: boolean) => {
  if (!testcaseSets.value) return
  testcaseLoading.value = true
  useApi(
    ManageProblems.changeTestcaseState,
    [props.problemId, testcases.value![i].id],
    {},
    {
      testcaseSetId: testcaseSets.value[j].id,
      state: v
    }
  )
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
</script>

<template>
  <v-container class="testcase">
    <v-card class="mb-8" variant="outlined" :loading="!testcaseSets">
      <v-card-title>テストケースセット一覧</v-card-title>
      <v-card-text class="set-list">
        <v-table v-if="testcaseSets">
          <thead>
            <tr>
              <th>テストケースセット名</th>
              <th>配点</th>
              <th>サンプル</th>
              <th />
            </tr>
          </thead>
          <tbody>
            <tr v-for="set in testcaseSets" :key="set.name">
              <td v-text="set.name" />
              <td v-text="set.points" />
              <td class="is-sample" :class="{ '--sample': set.isSample }">
                {{ set.isSample ? 'Yes' : 'No' }}
              </td>
              <td>
                <v-icon size="small" @click="editSet(set.id)"
                  >mdi-pencil</v-icon
                >
                <v-icon
                  v-if="!['all', 'sample'].includes(set.name)"
                  size="small"
                  @click="deleteSet(set.id)"
                  >mdi-delete</v-icon
                >
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
        <v-table v-if="testcases" density="compact">
          <thead>
            <tr>
              <th class="testcase-list__row-testcase-name">テストケース名</th>
              <th
                v-for="set in testcaseSets"
                :key="set.name"
                class="testcase-list__row-set"
                v-text="set.name"
              />
              <th class="testcase-list__row-action" />
            </tr>
          </thead>
          <tbody>
            <tr v-for="(testcase, i) in testcases" :key="testcase.name">
              <td v-text="testcase.name" />
              <td
                v-for="(_, j) in testcase.testcaseSets"
                :key="`${testcase.name}_${j}`"
              >
                <v-checkbox
                  class="mt-0"
                  :model-value="testcases[i].testcaseSets[j]"
                  color="orange"
                  hide-details
                  @update:model-value="(v) => changeTestcaseState(i as number, j as number, v)"
                />
              </td>
              <td>
                <v-btn
                  icon="mdi-pencil"
                  size="small"
                  :disabled="testcaseLoading"
                  variant="text"
                  @click="viewTestcase(testcase.id)"
                />
                <v-btn
                  icon="mdi-delete"
                  size="small"
                  :disabled="testcaseLoading"
                  variant="text"
                  @click="deleteTestcase(testcase.id)"
                />
              </td>
            </tr>
          </tbody>
        </v-table>
        <v-btn
          class="mt-2"
          color="primary"
          prepend-icon="mdi-plus"
          @click.stop="testcaseDialog = true"
        >
          テストケースを追加
        </v-btn>
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
  </v-container>
</template>

<style scoped lang="scss"></style>
