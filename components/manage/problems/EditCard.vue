<script setup lang="ts">
import { ref, reactive } from 'vue'
import ManageProblems from '~/utils/apis/ManageProblems'
import { Difficulties } from '~/constants/difficulty'

const rules = {
  required: [(text: string) => /\S+/.test(text) || 'このフィールドは必須です']
}

const props = defineProps<{
  problemId: number
}>()

const emits = defineEmits<{
  update: []
}>()

const modals = reactive({
  problemStatement: false,
  constraints: false,
  input: false,
  output: false
})

const valid = ref(false)
const updated = ref(false)

const testerName = ref('')
const testerError = ref('')
const testerLoading = ref(false)

const { data: problem, refresh } = await useApi(ManageProblems.getProblem, [
  props.problemId
])
const testers = computed(() => problem.value?.testers ?? [])

const onSubmit = async () => {
  if (!problem.value) return
  await useApi(
    ManageProblems.updateProblem,
    [props.problemId],
    {},
    {
      problem: {
        name: problem.value.name,
        difficulty: problem.value.difficulty,
        constraints: problem.value.constraints,
        inputFormat: problem.value.inputFormat,
        outputFormat: problem.value.outputFormat,
        statement: problem.value.statement,
        executionTimeLimit: problem.value.executionTimeLimit
      }
    }
  )
  updated.value = true
  await refresh()
  emits('update')
}

const addTester = async () => {
  testerLoading.value = true
  await useApi(
    ManageProblems.addTester,
    [props.problemId],
    {},
    {
      userName: testerName.value
    }
  ).then(async ({ error }) => {
    if (error.value) {
      if (error.value.data) {
        testerError.value = error.value.data.error
      } else {
        alert('テスターの追加に失敗しました。')
      }
      return
    }
    testerName.value = ''
    testerError.value = ''
    await refresh()
  })
  testerLoading.value = false
}

const removeTester = async (name: string) => {
  await useApi(
    ManageProblems.removeTester,
    [props.problemId],
    {},
    {
      userName: name
    }
  ).then(async ({ error }) => {
    if (error.value) {
      alert('テスターの削除に失敗しました。')
      return
    }
    await refresh()
  })
}
</script>
<template>
  <v-card class="wrapper" :loading="!problem">
    <v-card-text>
      <v-form v-if="problem != null" v-model="valid" @submit.prevent="onSubmit">
        <v-row>
          <v-col cols="12" md="4" lg="1" class="py-1">
            <v-text-field :model-value="problemId" readonly label="ID" />
          </v-col>
          <v-col cols="12" md="8" lg="7" class="py-1">
            <v-text-field
              v-model="problem.name"
              :rules="rules.required"
              label="問題名"
            />
          </v-col>
          <v-col cols="12" md="7" lg="2" class="py-1">
            <v-select
              v-model="problem.difficulty"
              :items="Difficulties"
              label="難易度"
            />
          </v-col>
          <v-col cols="12" md="5" lg="2" class="py-1">
            <v-text-field
              v-model.number="problem.executionTimeLimit"
              :rules="rules.required"
              type="number"
              label="実行時間制限"
              suffix="ms"
              min="1"
              max="20000"
            />
          </v-col>
        </v-row>
        <!-- 問題文 -->
        <v-row justify="end">
          <v-btn
            class="mr-4"
            variant="text"
            width="auto"
            color="purple"
            @click="modals.problemStatement = true"
            >プレビュー
          </v-btn>
        </v-row>
        <v-row>
          <v-col cols="12" class="pt-0 pb-2">
            <v-textarea
              v-model="problem.statement"
              :rules="rules.required"
              label="問題文 (Markdown)"
              variant="outlined"
              auto-grow
            />
          </v-col>
        </v-row>
        <MarkdownPreviewModal
          title="プレビュー - 問題文"
          :markdown="problem.statement"
          :value="modals.problemStatement"
          @close="modals.problemStatement = false"
        />
        <!-- 制約 -->
        <v-row justify="end">
          <v-btn
            class="mr-4"
            variant="text"
            width="auto"
            color="purple"
            @click="modals.constraints = true"
            >プレビュー
          </v-btn>
        </v-row>
        <v-row>
          <v-col cols="12" class="pt-0 pb-2">
            <v-textarea
              v-model="problem.constraints"
              :rules="rules.required"
              label="制約 (Markdown)"
              variant="outlined"
              auto-grow
            />
          </v-col>
        </v-row>
        <MarkdownPreviewModal
          title="プレビュー - 制約"
          :markdown="problem.constraints"
          :value="modals.constraints"
          @close="modals.constraints = false"
        />
        <!-- 入力 -->
        <v-row justify="end">
          <v-btn
            class="mr-4"
            variant="text"
            width="auto"
            color="purple"
            @click="modals.input = true"
            >プレビュー
          </v-btn>
        </v-row>
        <v-row>
          <v-col cols="12" class="pt-0 pb-2">
            <v-textarea
              v-model="problem.inputFormat"
              :rules="rules.required"
              label="入力 (Markdown)"
              variant="outlined"
              auto-grow
            />
          </v-col>
          <v-col cols="12">
            入力形式を示す場合は <code>&lt;div class="code-math"&gt;</code> +
            改行 2 個と
            <code>&lt;/div&gt;</code> で囲むと、中で数式を使うことができます。
          </v-col>
        </v-row>
        <MarkdownPreviewModal
          title="プレビュー - 入力"
          :markdown="problem.inputFormat"
          :value="modals.input"
          @close="modals.input = false"
        />
        <!-- 出力 -->
        <v-row justify="end">
          <v-btn
            class="mr-4"
            variant="text"
            width="auto"
            color="purple"
            @click="modals.output = true"
            >プレビュー
          </v-btn>
        </v-row>
        <v-row>
          <v-col cols="12" class="pt-0 pb-2">
            <v-textarea
              v-model="problem.outputFormat"
              :rules="rules.required"
              label="出力 (Markdown)"
              variant="outlined"
              auto-grow
            />
          </v-col>
        </v-row>
        <MarkdownPreviewModal
          title="プレビュー - 出力"
          :markdown="problem.outputFormat"
          :value="modals.output"
          @close="modals.output = false"
        />
        <v-row>
          <v-col cols="12">
            <ProblemsHtmlTagExpansion />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <h4>テスターの管理</h4>
            <ul v-if="testers.length" class="text-body-1 text-black my-4">
              <li v-for="tester in testers" :key="`tester-${tester}`">
                {{ tester }}
                <v-icon class="ml-2" size="small" @click="removeTester(tester)"
                  >mdi-close-circle-outline</v-icon
                >
              </li>
            </ul>
            <p v-else class="text-body-2 my-2">
              テスターは登録されていません。
            </p>
            <v-text-field
              v-model="testerName"
              class="edit-problem-card__add-tester"
              placeholder="テスターを追加"
              :loading="testerLoading"
              density="compact"
              hide-details
              @keydown.enter="addTester"
            />
            <v-btn
              size="small"
              color="primary"
              class="mt-2"
              :loading="testerLoading"
              @click="addTester"
              >追加</v-btn
            >
            <p class="text-red mt-2" v-text="testerError" />
          </v-col>
        </v-row>
        <!-- 登録ボタン -->
        <v-row>
          <v-col cols="12">
            <v-btn :disabled="!valid" color="primary" type="submit" block>
              更新
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
      <v-snackbar v-model="updated" :timeout="4000">
        問題を更新しました。
      </v-snackbar>
    </v-card-text>
  </v-card>
</template>

<style scoped lang="scss"></style>
