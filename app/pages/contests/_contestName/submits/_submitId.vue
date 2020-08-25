<template>
  <v-card v-if="!errorMessage" :loading="!submit">
    <v-card-title v-if="submit">提出 #{{ submit.id }}</v-card-title>
    <v-card-text>
      <v-container v-if="submit">
        <v-row>
          <v-col cols="12" lg="8">
            <v-switch
              v-model="autoHeight"
              class="d-inline-flex"
              color="amber darken-3"
              dense
              label="高さを自動調節"
            />
            <v-btn
              class="ml-4"
              outlined
              small
              width="150"
              :disabled="showCopiedMessage"
              @click="copy"
              >{{
                showCopiedMessage ? 'コピーしました!' : 'ソースコードをコピー'
              }}</v-btn
            >
            <Editor
              v-show="submit"
              ref="editor"
              class="editor"
              :language="language"
              :auto-height="autoHeight"
              read-only
            />
          </v-col>
          <v-col cols="12" lg="4">
            <v-simple-table dense class="submit-table">
              <tbody>
                <tr>
                  <th>提出日時</th>
                  <td v-text="formatDate(submit.timestamp)" />
                </tr>
                <tr>
                  <th>問題</th>
                  <td>
                    <nuxt-link
                      :to="`/contests/${contest.slug}/tasks/${submit.task.slug}`"
                    >
                      {{ submit.task.position }}: {{ submit.task.name }}
                    </nuxt-link>
                  </td>
                </tr>
                <tr>
                  <th>ユーザ</th>
                  <td v-text="submit.user.name" />
                </tr>
                <tr>
                  <th>言語</th>
                  <td v-text="language.name" />
                </tr>
                <tr>
                  <th>得点</th>
                  <td v-text="submit.point" />
                </tr>
                <tr>
                  <th>結果</th>
                  <td>
                    <ResultChip
                      :status="submit.status"
                      :judge-status="submit.judgeStatus"
                    />
                  </td>
                </tr>
                <tr v-if="submit.executionTime != null">
                  <th>実行時間</th>
                  <td>{{ submit.executionTime }} ms</td>
                </tr>
                <tr v-if="submit.executionMemory != null">
                  <th>メモリ</th>
                  <td>{{ submit.executionMemory || '---' }} KB</td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-col>
        </v-row>
        <v-row v-if="submit.compileError">
          <v-col cols="12">
            <h3>コンパイルエラー</h3>
            <pre
              class="compile-error"
            ><code v-text="submit.compileError" /></pre>
          </v-col>
        </v-row>
        <v-row v-if="submit.testcaseResults.length">
          <v-col cols="12">
            <TestcaseResultsTable
              :testcase-results="submit.testcaseResults"
              :sample-count="submit.sampleCount"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
  <v-alert v-else type="error">
    {{ errorMessage }}
  </v-alert>
</template>

<script lang="ts">
import { Component, mixins, Ref } from 'nuxt-property-decorator'
import dayjs from 'dayjs'
import MixinContest from '~/mixins/contest'
import Editor from '~/components/Editor.vue'
import { SubmitDetail } from '~/types/submits'
import { HttpError } from '~/utils/axios'
import ResultChip from '~/components/submits/ResultChip.vue'
import TestcaseResultsTable from '~/components/submits/TestcaseResultsTable.vue'
import { copy } from '~/utils/clipboard'

@Component({
  components: { TestcaseResultsTable, ResultChip, Editor },
  layout: 'contest'
})
export default class PageSubmitDetail extends mixins(MixinContest) {
  head() {
    return {
      title: `提出 #${this.submit?.id} - ${this.contest?.name}`,
      titleTemplate: null
    }
  }

  validate({ params }: { params: { [key: string]: string } }): boolean {
    return /^[1-9]\d*$/.test(params.submitId)
  }

  @Ref()
  editor!: any

  submit: SubmitDetail | null = null
  errorMessage: string | null = null
  autoHeight = false
  showCopiedMessage = false

  async fetch() {
    await this.getContest()
    await this.$api.Contests.showSubmit(
      this.$route.params.contestName,
      Number(this.$route.params.submitId)
    )
      .then((res) => {
        this.submit = res
      })
      .catch((error: Error) => {
        if (error instanceof HttpError) {
          this.errorMessage = error.response.data.error
        }
      })
    this.editor.value = this.submit!.source
  }

  copy() {
    if (this.submit) copy(this.submit.source)
    this.showCopiedMessage = true
    setTimeout(() => (this.showCopiedMessage = false), 3000)
  }

  formatDate(date: Date): string {
    const dt = dayjs(date)
    return dt.format('YYYY/MM/DD HH:mm:ss')
  }

  get language() {
    if (!this.submit) return null
    return this.$getLanguage(this.submit.lang)
  }
}
</script>

<style scoped lang="scss">
.compile-error code {
  @include block-code();
  font-size: 0.8rem;
  line-height: 1.4;
  overflow: scroll;
}
</style>
