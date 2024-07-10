<script setup lang="ts">
import { VForm } from 'vuetify/components'
import ManageProblems from '~/utils/apis/ManageProblems'

const props = defineProps<{
  value: boolean
  readonly?: boolean
  problemId: number
  testcaseId: number | null
  testcaseNames: string[]
}>()

const ok = ref(false)
const loading = ref(false)
type ParamsType = {
  name: string
  input: string
  output: string
  explanation: string | null
}
const params = ref<ParamsType>({
  name: '',
  input: '',
  output: '',
  explanation: ''
})

const rules = {
  required: (v: string) => !!v || 'このフィールドは必須です。',
  testcaseName: (v: string) => /^\w+$/.test(v) || 'テストケース名が無効です。'
}

const createTestcaseModal = ref<VForm | null>(null)

watch(
  () => props.value,
  async () => {
    if (!props.value) {
      loading.value = false
      return
    }
    if (props.testcaseId == null) {
      params.value = {
        name: '',
        input: '',
        output: '',
        explanation: ''
      }
      createTestcaseModal.value?.resetValidation()
      return
    }
    loading.value = true
    const { data } = await useApi(ManageProblems.getTestcase, [
      props.problemId,
      props.testcaseId
    ])
    if (data.value) params.value = data.value
    loading.value = false
  }
)

const emits = defineEmits<{
  close: []
  update: [params: ParamsType]
  create: [params: ParamsType]
}>()
const close = () => emits('close')
const formatTestcase = (s: string): string => {
  if (!s.endsWith('\n')) s += '\n'

  let tmp: string[] = []
  const res: string[] = []
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '\r') {
      if (i < s.length - 1 && s[i + 1] === '\n') continue
      res.push(tmp.join(''))
      tmp = []
    } else {
      tmp.push(s[i])
    }
  }

  if (tmp.length > 0) res.push(tmp.join(''))

  return res.join('\n')
}

const submit = () => {
  loading.value = true
  params.value = {
    ...params.value,
    input: formatTestcase(params.value.input),
    output: formatTestcase(params.value.output)
  }
  if (props.testcaseId) {
    emits('update', params.value)
  } else {
    emits('create', params.value)
  }
}

const check = (v: string) => {
  const max = props.testcaseId ? 1 : 0
  return (
    props.testcaseNames.filter((name) => name === v).length <= max ||
    'この名前のテストケースは既に存在します。'
  )
}
</script>

<template>
  <v-dialog :model-value="value" persistent>
    <v-card :loading="loading">
      <v-card-title v-if="!readonly">テストケースを追加</v-card-title>
      <v-card-text>
        <v-form ref="createTestcase" v-model="ok">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="params.name"
                  label="テストケース名"
                  required
                  :readonly="readonly"
                  :rules="[rules.required, rules.testcaseName, check]"
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="params.input"
                  label="入力"
                  required
                  :readonly="readonly"
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="params.output"
                  label="出力"
                  required
                  :readonly="readonly"
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="params.explanation"
                  rows="2"
                  :readonly="readonly"
                  label="説明"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn :disabled="loading" variant="text" color="red" @click="close"
          >閉じる</v-btn
        >
        <v-btn
          v-if="!readonly"
          variant="text"
          color="primary"
          :disabled="!ok || loading"
          @click="submit"
          >保存</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss"></style>
