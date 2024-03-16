<script setup lang="ts">
import { ref, reactive } from 'vue'
import { FetchError } from 'ofetch'
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

const addTester = async (name: string) => {
  testerLoading.value = true
  try {
    await http(ManageProblems.addTester.$path([props.problemId]), {
      method: 'POST',
      body: {
        userName: name
      }
    })
    testerError.value = ''
  } catch (error: unknown) {
    if (error instanceof FetchError && error?.data?.error) {
      testerError.value = error.data.error
    } else {
      testerError.value = 'テスターの追加に失敗しました。'
    }
  } finally {
    await refresh()
    testerLoading.value = false
  }
}

const removeTester = async (name: string) => {
  testerLoading.value = true
  try {
    await http(ManageProblems.removeTester.$path([props.problemId]), {
      method: 'DELETE',
      body: {
        userName: name
      }
    })
  } catch (err: unknown) {
    alert('テスターの削除に失敗しました。')
  } finally {
    await refresh()
    testerLoading.value = false
  }
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
              counter
              maxlength="4000"
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
              counter
              maxlength="2000"
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
              counter
              maxlength="1000"
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
              counter
              maxlength="1000"
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
            <ManageUserList
              :loading="testerLoading"
              :users="testers"
              :error="testerError"
              placeholder="テスターを追加"
              @add="addTester"
              @remove="removeTester"
            >
              <template #emptyMessage>テスターは追加されていません</template>
              <template #subheader>Testers</template>
            </ManageUserList>
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
