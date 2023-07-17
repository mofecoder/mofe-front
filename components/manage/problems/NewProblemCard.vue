<script setup lang="ts">
import { Difficulties } from '~/constants/difficulty'
import { ref } from 'vue'
import ManageProblems from '~/utils/apis/ManageProblems'

const rules = {
  required: [(text: string) => /\S+/.test(text) || 'このフィールドは必須です']
}

const modals = reactive({
  problemStatement: false,
  constraints: false,
  input: false,
  output: false
})

const valid = ref(false)

const problem = ref({
  name: '',
  difficulty: '',
  constraints: '',
  inputFormat: '',
  outputFormat: '',
  statement: ''
})

const router = useRouter()
const onSubmit = async () => {
  if (!problem.value) return
  const { data, error } = await useApi(
    ManageProblems.createProblem,
    [],
    {},
    {
      problem: {
        name: problem.value.name,
        difficulty: problem.value.difficulty,
        constraints: problem.value.constraints,
        inputFormat: problem.value.inputFormat,
        outputFormat: problem.value.outputFormat,
        statement: problem.value.statement
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
              v-model="problem.difficulty"
              :items="Difficulties"
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

        <!-- 登録ボタン -->
        <v-row>
          <v-col cols="12">
            <v-btn :disabled="!valid" color="primary" type="submit" block>
              登録
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<style scoped lang="scss"></style>
