<template>
  <v-container class="testcase">
    <template v-if="problem">
      <div class="testcase__title">{{ problem.name }} テストケース編集</div>
    </template>
    <v-card class="mb-8" :loading="!testcaseSets">
      <v-card-title>テストケースセット一覧</v-card-title>
      <v-card-text class="set-list">
        <v-simple-table v-if="testcaseSets">
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
                <v-icon small dense @click="editSet(set.id)">mdi-pencil</v-icon>
                <v-icon
                  v-if="!['all', 'sample'].includes(set.name)"
                  small
                  dense
                  @click="deleteSet(set.id)"
                  >mdi-delete</v-icon
                >
              </td>
            </tr>
          </tbody>
        </v-simple-table>
        <v-btn color="primary" small @click="addSet"
          >テストケースセットを追加</v-btn
        >
      </v-card-text>
    </v-card>
    <v-card class="mb-8" :loading="!testcases || testcaseLoading">
      <v-card-title>テストケース一覧</v-card-title>
      <v-card-text class="testcase-list">
        <v-simple-table v-if="testcases" dense>
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
                  :input-value="testcases[i].testcaseSets[j]"
                  dense
                  color="orange"
                  hide-details
                  @change="(v) => changeTestcaseState(i, j, v)"
                />
              </td>
              <td>
                <v-icon
                  small
                  dense
                  :disabled="testcaseLoading"
                  @click="viewTestcase(testcase.id)"
                  >mdi-eye</v-icon
                >
                <v-icon
                  small
                  dense
                  :disabled="testcaseLoading"
                  @click="deleteTestcase(testcase.id)"
                  >mdi-delete</v-icon
                >
              </td>
            </tr>
          </tbody>
        </v-simple-table>
        <v-btn
          class="mt-2"
          color="primary"
          small
          @click.stop="testcaseDialog = true"
        >
          テストケースを追加
        </v-btn>
      </v-card-text>
    </v-card>
    <v-card :loading="uploadLoading">
      <v-card-title>テストケースをアップロードする</v-card-title>
      <v-card-text>
        <v-expansion-panels class="mb-8">
          <TestcaseUploadExpansionPanel />
        </v-expansion-panels>
        <v-form @submit.prevent="submit">
          <v-file-input
            label="アップロードするファイル"
            placeholder="ZIPファイルを選択"
            accept=".zip"
            @change="change"
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
    <EditTestcaseModal
      :value="testcaseDialog"
      :problem-id="problemId"
      :testcase-id="testcaseId"
      :readonly="!!testcaseId"
      :testcase-names="testcaseNames"
      @close="closeModal"
      @create="createTestcase"
    />
    <EditTestcaseSetModal
      :id.sync="editingTestcaseSetId"
      :value="testcaseSetDialog"
      :problem-id="problemId"
      :testcase-set-names="testcaseSetNames"
      @save="saveSet"
      @close="closeSetModal"
    />
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { ProblemDetail, Testcase, TestcaseSet } from '~/types/problems'
import { HttpError } from '~/utils/axios'
import TestcaseUploadExpansionPanel from '~/components/writer/TestcaseUploadExpansionPanel.vue'
import EditTestcaseModal from '~/components/modals/EditTestcaseModal.vue'
import EditTestcaseSetModal from '~/components/modals/EditTestcaseSetModal.vue'
@Component({
  components: {
    EditTestcaseSetModal,
    EditTestcaseModal,
    TestcaseUploadExpansionPanel
  },
  middleware: 'authenticated'
})
export default class PagePageWriterTaskTestcases extends Vue {
  head() {
    return {
      title: `[${this.problemId}] テストケースの設定`
    }
  }

  validate({ params }: { params: { [_: string]: string } }): boolean {
    return /^[1-9]\d*$/.test(params.problemId)
  }

  problem: ProblemDetail | null = null
  testcaseSets: TestcaseSet[] | null = null
  testcases: Testcase[] | null = null
  file: File | null = null
  messages: string[] = []
  ok: boolean | null = null
  testcaseDialog = false
  testcaseId: number | null = null
  testcaseSetDialog = false
  testcaseLoading = false
  editingTestcaseSetId: number | null = null
  uploadLoading = false

  get problemId(): number {
    return Number(this.$route.params.problemId)
  }

  get testcaseNames() {
    return this.testcases?.map((x) => x.name) || []
  }

  get testcaseSetNames() {
    return this.testcaseSets?.map((x) => x.name) || []
  }

  async created() {
    await this.update()
  }

  async update() {
    this.problem = await this.$api.Problems.show(this.problemId)
    const res = await this.$api.Testcases.index(this.problemId)
    this.testcaseSets = res.testcaseSets
    this.testcases = res.testcases
  }

  change(file: File) {
    this.file = file || null
  }

  submit() {
    if (!this.file) return
    this.uploadLoading = true
    this.$api.Testcases.uploadTestcases(this.problemId, this.file)
      .then(async ({ messages }: { messages: string[] }) => {
        this.messages = messages
        this.ok = true
        this.file = null
        await this.update()
      })
      .catch((exception: HttpError) => {
        const res: any = exception.response
        this.messages = [res.error]
        this.ok = false
      })
      .finally(() => {
        this.uploadLoading = false
      })
  }

  async deleteTestcase(id: number) {
    this.testcaseLoading = true
    await this.$api.Testcases.delete(this.problemId, id)
    await this.update()
    this.testcaseLoading = false
  }

  async createTestcase(params: {
    name: string
    input: string
    output: string
    explanation: string
  }) {
    try {
      await this.$api.Testcases.destroy(this.problemId, params)
    } catch (error) {
      if (error.response.status === 400) {
        alert('テストケースの追加に失敗しました: ' + error.response.data.error)
        return
      }
    }
    await this.update()
    this.testcaseDialog = false
  }

  async saveSet(params: { name: string; points: string }) {
    if (Number.isNaN(Number(params.points))) return
    const create = this.editingTestcaseSetId == null
    try {
      if (this.editingTestcaseSetId == null) {
        await this.$api.Testcases.createTestcaseSet(this.problemId, {
          name: params.name,
          points: Number(params.points)
        })
      } else {
        await this.$api.Testcases.updateTestcaseSet(
          this.problemId,
          this.editingTestcaseSetId,
          {
            name: params.name,
            points: Number(params.points)
          }
        )
        this.editingTestcaseSetId = null
      }
    } catch (error) {
      if (error.response.status === 400) {
        alert(
          `テストケースセットの${create ? '追加' : '更新'}に失敗しました: ${
            error.response.data.error
          }`
        )
        return
      }
    }
    await this.update()
    this.testcaseSetDialog = false
  }

  addSet() {
    this.editSet(null)
  }

  editSet(id: number | null) {
    this.editingTestcaseSetId = id
    this.testcaseSetDialog = true
  }

  async deleteSet(id: number) {
    try {
      await this.$api.Testcases.destroyTestcaseSet(this.problemId, id)
    } catch (error) {
      alert('テストケースセットの削除に失敗しました。')
      return
    }
    await this.update()
  }

  async changeTestcaseState(i: number, j: number, v: true | null) {
    if (!this.testcaseSets) return
    this.testcaseLoading = true
    await this.$api.Testcases.changeTestcaseState(
      this.problemId,
      this.testcases![i].id,
      this.testcaseSets[j].id,
      v || false
    )
    const res = await this.$api.Testcases.index(this.problemId)
    this.testcaseSets = res.testcaseSets
    this.testcases = res.testcases
    this.testcaseLoading = false
  }

  viewTestcase(id: number) {
    this.testcaseId = id
    this.testcaseDialog = true
  }

  closeModal() {
    this.testcaseId = null
    this.testcaseDialog = false
  }

  closeSetModal() {
    this.editingTestcaseSetId = null
    this.testcaseSetDialog = false
  }
}
</script>

<style scoped lang="scss">
.set-list {
  @include card-text-reset();
}
.testcase {
  &__title {
    font-size: 1.7rem;
    font-weight: normal;
  }
  &__result {
    &__status {
      font-size: 1.4rem;
      &.ok {
        color: green;
      }
      &.ng {
        color: red;
      }
    }
  }
}
.testcase-list {
  &__row-set {
    width: 2em;
  }
  &__row-action {
    width: 6em;
  }
}
</style>
