<template>
  <v-card class="wrapper">
    <v-card-text>
      <v-form v-model="valid" @submit.prevent="onSubmit">
        <v-row>
          <v-col cols="12" md="4" lg="2" class="py-1">
            <v-text-field v-model="problemId" disabled label="問題 ID" />
          </v-col>
          <v-col cols="12" md="8" lg="7" class="py-1">
            <v-text-field
              v-model="problem.name"
              :rules="rules.required"
              label="問題名"
            />
          </v-col>
          <v-col cols="12" lg="3" class="py-1">
            <v-select
              v-model="problem.difficulty"
              :items="difficulties"
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
        <markdown-preview-modal
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
        <markdown-preview-modal
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
        <markdown-preview-modal
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
        <markdown-preview-modal
          title="プレビュー - 出力"
          :markdown="problem.outputFormat"
          :value="modals.output"
          @close="modals.output = false"
        />
        <v-row>
          <v-col cols="12">
            <HtmlTagExpansionPanel />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <h4>テスターの管理</h4>
            <ul v-if="testers.length" class="text-body-1 text-black">
              <li v-for="tester in testers" :key="`tester-${tester}`">
                {{ tester }}
                <v-icon class="ml-2" size="small" @click="removeTester(tester)"
                  >mdi-close-circle-outline</v-icon
                >
              </li>
            </ul>
            <p v-else class="text-body-2">テスターは登録されていません。</p>
            <v-text-field
              v-model="testerName"
              class="edit-problem-card__add-tester"
              placeholder="テスターを追加"
              :loading="testerLoading"
              hide-details
              @keydown.enter="addTester"
            />
            <v-btn
              size="small"
              color="primary"
              :loading="testerLoading"
              @click="addTester"
              >追加</v-btn
            >
            <p class="text-red" v-text="testerError" />
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
import MarkdownPreviewModal from '../../comp/modals/MarkdownPreviewModal.vue'
import { ProblemParams } from '~/types/problems'
import { HttpError } from '~/utils/axios'
import HtmlTagExpansionPanel from '../../comp/writer/HtmlTagExpansionPanel.vue'

@Component({
  components: { HtmlTagExpansionPanel, MarkdownPreviewModal }
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

  problem: ProblemParams = {
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
  testerLoading = false

  @Prop({ required: true })
  problemId!: number

  async fetch() {
    const tmp = await this.$api.Problems.show(this.problemId)
    this.problem = {
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
    await this.$api.Problems.update(this.problemId, this.problem)
    this.updated = true
    await this.$fetch()
  }

  async addTester() {
    this.testerLoading = true
    await this.$api.Problems.addTester(this.problemId, this.testerName)
      .then(async () => {
        this.testerLoading = false
        this.testerName = ''
        this.testerError = ''
        await this.$fetch()
      })
      .catch((err) => {
        this.testerLoading = false
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

  judge() {
    this.$router.push(this.$router.resolve('judge', undefined, true).location)
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
