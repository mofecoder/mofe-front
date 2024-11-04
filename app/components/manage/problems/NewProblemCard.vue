<script setup lang="ts">
import { ref } from 'vue'
import { Difficulties } from '~/constants/difficulty'
import ManageProblems from '~/utils/apis/ManageProblems'
import type { Difficulty } from '~/types/task'
import type { ProblemDetail } from '~/types/problems'

const rules = {
  required: [(text: string) => /\S+/.test(text) || 'このフィールドは必須です']
}

const valid = ref(false)

const problem = ref({
  name: '',
  difficulty: 'Milk',
  constraints: '',
  inputFormat: '',
  outputFormat: '',
  partialScores: '',
  statement: ''
})

const router = useRouter()

const modals = reactive({
  problemStatement: false,
  constraints: false,
  partialScores: false,
  input: false,
  output: false
})

const onSubmit = async () => {
  if (!problem.value) return
  const { data, error } = await useApi(
    ManageProblems.createProblem,
    [],
    {},
    {
      problem: {
        name: problem.value.name,
        difficulty: problem.value.difficulty as Difficulty,
        executionTimeLimit: 2000,
        constraints: problem.value.constraints,
        partialScores: problem.value.partialScores || null,
        inputFormat: problem.value.inputFormat,
        outputFormat: problem.value.outputFormat,
        statement: problem.value.statement,
        submissionLimit1: 5,
        submissionLimit2: 60
      }
    }
  )
  if (error.value || !data.value) {
    alert('問題の作成に失敗しました')
    return
  }
  await router.push(`/manage/problems/${data.value.id}`)
}
</script>

<template>
  <v-card class="wrapper" :loading="!problem">
    <v-card-text>
      <v-form v-if="problem != null" v-model="valid" @submit.prevent="onSubmit">
        <v-row>
          <v-col cols="12" lg="7" class="py-1">
            <v-text-field
              v-model="problem.name"
              :rules="rules.required"
              label="問題名"
            />
          </v-col>
          <v-col cols="12" lg="5" class="py-1">
            <v-select
              v-model="problem.difficulty as ProblemDetail['difficulty']"
              :items="Difficulties"
              :rules="rules.required"
              label="難易度"
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
        <!-- 部分点 -->
        <v-row justify="end">
          <v-btn
            class="mr-4"
            variant="text"
            width="auto"
            color="purple"
            @click="modals.partialScores = true"
            >プレビュー
          </v-btn>
        </v-row>
        <v-row>
          <v-col cols="12" class="pt-0 pb-2">
            <v-textarea
              v-model="problem.partialScores"
              label="部分点 (Markdown)"
              variant="outlined"
              auto-grow
            />
          </v-col>
        </v-row>
        <MarkdownPreviewModal
          title="プレビュー - 部分点"
          :markdown="problem.partialScores"
          :value="modals.partialScores"
          @close="modals.partialScores = false"
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

        <!-- 登録ボタン -->
        <v-row>
          <v-col cols="12">
            <v-btn
              :disabled="!valid"
              color="primary"
              type="submit"
              block
              prepend-icon="mdi-check"
            >
              問題を作成
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<style scoped lang="scss"></style>
