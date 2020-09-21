<template>
  <v-card class="wrapper">
    <v-card-title class="headline edit-problem-card">
      <p>問題の編集</p>
      <v-btn color="purple white--text" @click="testcase"
        >テストケースの設定
      </v-btn>
    </v-card-title>
    <v-card-text>
      <v-form v-model="valid" @submit.prevent="onSubmit">
        <v-row>
          <v-col cols="12" class="py-1">
            <v-text-field
              v-model="content.name"
              :rules="rules.required"
              label="問題名"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="py-1">
            <v-select
              v-model="content.difficulty"
              :items="difficulties"
              label="難易度"
            />
          </v-col>
        </v-row>
        <!-- 問題文 -->
        <v-row justify="end">
          <v-btn
            class="mr-4"
            text
            width="auto"
            color="purple"
            @click="modals.problemStatement = true"
            >プレビュー
          </v-btn>
        </v-row>
        <v-row>
          <v-col cols="12" class="pt-0 pb-2">
            <v-textarea
              v-model="content.statement"
              :rules="rules.required"
              label="問題文"
              outlined
              auto-grow
            />
          </v-col>
        </v-row>
        <markdown-preview-modal
          title="プレビュー - 問題文"
          :markdown="content.statement"
          :value="modals.problemStatement"
          @close="modals.problemStatement = false"
        />
        <!-- 制約 -->
        <v-row justify="end">
          <v-btn
            class="mr-4"
            text
            width="auto"
            color="purple"
            @click="modals.constraints = true"
            >プレビュー
          </v-btn>
        </v-row>
        <v-row>
          <v-col cols="12" class="pt-0 pb-2">
            <v-textarea
              v-model="content.constraints"
              :rules="rules.required"
              label="制約"
              outlined
              auto-grow
            />
          </v-col>
        </v-row>
        <markdown-preview-modal
          title="プレビュー - 制約"
          :markdown="content.constraints"
          :value="modals.constraints"
          @close="modals.constraints = false"
        />
        <!-- 入力 -->
        <v-row justify="end">
          <v-btn
            class="mr-4"
            text
            width="auto"
            color="purple"
            @click="modals.input = true"
            >プレビュー
          </v-btn>
        </v-row>
        <v-row>
          <v-col cols="12" class="pt-0 pb-2">
            <v-textarea
              v-model="content.inputFormat"
              :rules="rules.required"
              label="入力"
              outlined
              auto-grow
            />
          </v-col>
        </v-row>
        <markdown-preview-modal
          title="プレビュー - 入力"
          :markdown="content.inputFormat"
          :value="modals.input"
          @close="modals.input = false"
        />
        <!-- 出力 -->
        <v-row justify="end">
          <v-btn
            class="mr-4"
            text
            width="auto"
            color="purple"
            @click="modals.output = true"
            >プレビュー
          </v-btn>
        </v-row>
        <v-row>
          <v-col cols="12" class="pt-0 pb-2">
            <v-textarea
              v-model="content.outputFormat"
              :rules="rules.required"
              label="出力"
              outlined
              auto-grow
            />
          </v-col>
        </v-row>
        <markdown-preview-modal
          title="プレビュー - 出力"
          :markdown="content.outputFormat"
          :value="modals.output"
          @close="modals.output = false"
        />
        <v-row>
          <v-col cols="12">
            <h4>テスターの管理</h4>
            <ul v-if="testers.length" class="text-body-1 black--text">
              <li v-for="tester in testers" :key="`tester-${tester}`">
                {{ tester }}
                <v-icon small @click="removeTester(tester)">mdi-delete</v-icon>
              </li>
            </ul>
            <p v-else class="text-body-2">テスターは登録されていません。</p>
            <v-text-field
              v-model="testerName"
              class="edit-problem-card__add-tester"
              placeholder="テスターを追加"
              hide-details
              @keydown.enter="addTester"
            />
            <v-btn small color="primary" @click="addTester">追加</v-btn>
            <p class="red--text" v-text="testerError" />
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
<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { Difficulty } from '~/types/task'
import MarkdownPreviewModal from '~/components/modals/MarkdownPreviewModal.vue'
import { ProblemParams } from '~/types/problems'
import { HttpError } from '~/utils/axios'

@Component({
  components: { MarkdownPreviewModal }
})
export default class CreateProblemCard extends Vue {
  rules = {
    required: [(text: string) => /\S+/.test(text) || 'このフィールドは必須です']
  }

  difficulties: Difficulty[] = [
    'Milk',
    'Assam',
    'Benihuki',
    'Ceylon',
    'Darjeeling',
    'Earlgray',
    'Flavor',
    'ผักชี'
  ]

  content: ProblemParams = {
    name: '',
    difficulty: 'Milk',
    statement: '',
    constraints: '',
    inputFormat: '',
    outputFormat: ''
  }

  modals = {
    problemStatement: false,
    constraints: false,
    input: false,
    output: false
  }

  valid = false
  updated = false

  testerName = ''
  testers: string[] = []
  testerError = ''

  @Prop({ required: true })
  problemId!: number

  async fetch() {
    const tmp = await this.$api.Problems.show(this.problemId)
    this.content = {
      name: tmp.name,
      difficulty: tmp.difficulty,
      statement: tmp.statement,
      constraints: tmp.constraints,
      inputFormat: tmp.inputFormat,
      outputFormat: tmp.outputFormat
    }
    this.testers = tmp.testers
  }

  async onSubmit() {
    await this.$api.Problems.update(this.problemId, this.content)
    this.updated = true
    await this.$fetch()
  }

  async addTester() {
    await this.$api.Problems.addTester(this.problemId, this.testerName)
      .then(async () => {
        this.testerName = ''
        this.testerError = ''
        await this.$fetch()
      })
      .catch((err) => {
        if (err instanceof HttpError) {
          this.testerError = err.response.data.error
        } else {
          this.testerError = 'テスターの追加に失敗しました'
        }
      })
  }

  async removeTester(name: string) {
    await this.$api.Problems.removeTester(this.problemId, name)
      .then(async () => {
        await this.$fetch()
      })
      .catch(() => {
        alert('テスターの削除に失敗しました')
      })
  }

  testcase() {
    this.$router.push(
      this.$router.resolve('testcases', undefined, true).location
    )
  }
}
</script>

<style lang="scss" scoped>
.edit-problem-card {
  display: flex;
  justify-content: space-between;

  &__add-tester {
    display: inline-block;
    max-width: 8em;
  }
}
</style>
