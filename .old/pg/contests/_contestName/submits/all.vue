<template>
  <div>
    <template v-if="contest">
      <v-container class="pa-0" fluid>
        <v-card v-if="!errorMessage">
          <v-card-title>すべての提出</v-card-title>
          <v-card-text class="submit-card">
            <v-switch
              v-if="allowAdminMode"
              v-model="adminMode"
              color="orange"
              label="高頻度更新を有効にする"
            />
            <SubmitTable
              :api-call="apiCall"
              :interval="timeout"
              :submits="submits"
              :tasks="contest.tasks"
              :written-tasks="contest.writtenTasks.map((x) => x.slug)"
              @rejudge="rejudge"
            />
          </v-card-text>
        </v-card>
        <v-alert v-else type="error" icon="mdi-alert">
          {{ errorMessage }}
        </v-alert>
      </v-container>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, mixins, Watch } from 'nuxt-property-decorator'
import ContestHeader from '../../../../comp/ContestHeader.vue'
import ContestHeaderTab from '../../../../comp/ContestHeaderTab.vue'
import MathJax from '../../../../mx/mathjax'
import MixinContest from '../../../../mx/contest'
import SubmitTable from '../../../../comp/submits/SubmitTable.vue'
import { HttpError } from '~/composables/useHttp'
import { SubmissionResponse } from '~/apis/Contests'
@Component({
  components: { SubmitTable, ContestHeaderTab, ContestHeader },
  layout: 'contest'
})
export default class PageContest extends mixins(MathJax, MixinContest) {
  head() {
    return {
      title: `すべての提出 - ${this.contest?.name}`,
      titleTemplate: null
    }
  }

  adminMode = false
  submits: SubmissionResponse | null = null
  timeout: number = 30000
  errorMessage: string | null = null

  get allowAdminMode() {
    return !!this.contest?.writtenTasks.length
  }

  async apiCall(
    page: number,
    count: number,
    sortBy: string[],
    sortDesc: boolean[],
    filter: [string, string | string[]][]
  ) {
    return await this.$api.Contests.allSubmits(
      this.$route.params.contestName,
      page,
      count,
      sortBy,
      sortDesc,
      filter
    )
  }

  async rejudge(submitIds: number[]) {
    await this.$api.Contests.rejudge(this.contest!.slug, submitIds).catch(
      (err: HttpError) => {
        alert(
          err.response?.data.error || 'リジャッジのリクエストに失敗しました'
        )
      }
    )
  }

  @Watch('adminMode')
  onChangeAdminMode(value: boolean) {
    this.timeout = value ? 2000 : 30000
  }
}
</script>

<style lang="scss" scoped>
.submit-card {
  @include card-text-reset();
}
</style>
