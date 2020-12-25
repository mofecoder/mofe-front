<template>
  <v-dialog :value="value" persistent>
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
                  :rules="[rules.required]"
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="params.output"
                  label="出力"
                  required
                  :readonly="readonly"
                  :rules="[rules.required]"
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
        <v-btn text color="red" @click="close">閉じる</v-btn>
        <v-btn
          v-if="!readonly"
          text
          color="primary"
          :disabled="!ok"
          @click="submit"
          >保存</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Emit, Prop, Ref, Vue, Watch } from 'nuxt-property-decorator'

@Component
export default class EditTestcaseModal extends Vue {
  @Ref('createTestcase')
  createTestcaseModal: any

  @Prop({ required: true })
  value!: boolean

  @Prop()
  readonly?: boolean

  @Prop()
  problemId!: number

  @Prop()
  testcaseId!: number | null

  @Prop()
  testcaseNames!: string[]

  ok = false
  loading = false
  params = {
    name: '',
    input: '',
    output: '',
    explanation: '' as string | null
  }

  rules = {
    required: (v: string) => !!v || 'このフィールドは必須です。',
    testcaseName: (v: string) => /^\w+$/.test(v) || 'テストケース名が無効です。'
  }

  @Watch('value')
  async loadTestcase() {
    if (!this.value) {
      this.createTestcaseModal.resetValidation()
      this.params = {
        name: '',
        input: '',
        output: '',
        explanation: ''
      }
    }
    if (this.testcaseId == null) return
    this.loading = true
    this.params = await this.$api.Testcases.show(
      this.problemId,
      this.testcaseId
    )
    this.loading = false
  }

  @Emit('close')
  close() {}

  submit() {
    this.params = {
      ...this.params,
      input: this.formatTestcase(this.params.input),
      output: this.formatTestcase(this.params.output)
    }
    this.$emit(this.testcaseId ? 'update' : 'create', this.params)
  }

  check(v: string) {
    const max = this.testcaseId ? 1 : 0
    return (
      this.testcaseNames.filter((name) => name === v).length <= max ||
      'この名前のテストケースは既に存在します。'
    )
  }

  formatTestcase(s: string): string {
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
}
</script>

<style scoped lang="scss"></style>
