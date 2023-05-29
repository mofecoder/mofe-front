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
                <v-icon size="small" dense @click="editSet(set.id)"
                  >mdi-pencil</v-icon
                >
                <v-icon
                  v-if="!['all', 'sample'].includes(set.name)"
                  size="small"
                  dense
                  @click="deleteSet(set.id)"
                  >mdi-delete</v-icon
                >
              </td>
            </tr>
          </tbody>
        </v-table>
        <v-btn color="primary" size="small" @click="addSet"
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
        <v-table v-if="testcases" dense>
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
                  dense
                  color="orange"
                  hide-details
                  @update:model-value="(v) => changeTestcaseState(i, j, v)"
                />
              </td>
              <td>
                <v-icon
                  size="small"
                  dense
                  :disabled="testcaseLoading"
                  @click="viewTestcase(testcase.id)"
                  >mdi-pencil</v-icon
                >
                <v-icon
                  size="small"
                  dense
                  :disabled="testcaseLoading"
                  @click="deleteTestcase(testcase.id)"
                  >mdi-delete</v-icon
                >
              </td>
            </tr>
          </tbody>
        </v-table>
        <v-btn
          class="mt-2"
          color="primary"
          size="small"
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
      :testcase-names="testcaseNames"
      @close="closeModal"
      @create="createTestcase"
      @update="updateTestcase"
    />
    <EditTestcaseSetModal
      v-model:id="editingTestcaseSetId"
      :value="testcaseSetDialog"
      :problem-id="problemId"
      :testcase-set-names="testcaseSetNames"
      @save="saveSet"
      @close="closeSetModal"
    />
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { ProblemDetail, Testcase, TestcaseSet } from '~/types/problems'
import { HttpError } from '~/composables/useHttp'
import TestcaseUploadExpansionPanel from '../../comp/writer/TestcaseUploadExpansionPanel.vue'
import EditTestcaseModal from '../../comp/modals/EditTestcaseModal.vue'
import EditTestcaseSetModal from '../../comp/modals/EditTestcaseSetModal.vue'
@Component({
  components: {
    EditTestcaseSetModal,
    EditTestcaseModal,
    TestcaseUploadExpansionPanel
  }
})
export default class WriterTaskTestcases extends Vue {
  @Prop({ required: true })
  problemId!: number

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
        const res: any = exception.response.data
        this.messages = [res.error]
        this.ok = false
      })
      .finally(() => {
        this.uploadLoading = false
      })
  }

  async updateTestcase(params: {
    name: string
    input: string
    output: string
    explanation: string
  }) {
    try {
      await this.$api.Testcases.update(this.problemId, this.testcaseId!, params)
    } catch (error) {
      if (error.response.status === 400) {
        alert('テストケースの更新に失敗しました: ' + error.response.data.error)
        return
      }
    }
    await this.update()
    this.testcaseDialog = false
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
      await this.$api.Testcases.create(this.problemId, params)
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
