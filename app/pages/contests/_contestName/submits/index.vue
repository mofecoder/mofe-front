<template>
  <div>
    <template v-if="contest">
      <v-container class="pa-0" fluid>
        <v-card>
          <v-card-title>自分の提出</v-card-title>
          <v-card-text class="submit-card">
            <SubmitTable
              :api-call="apiCall"
              :interval="timeout"
              :submits="submits"
              :tasks="contest.tasks"
              :written-tasks="contest.writtenTasks.map((t) => t.slug)"
              @rejudge="rejudge"
            />
          </v-card-text>
        </v-card>
      </v-container>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import ContestHeader from '~/components/ContestHeader.vue'
import ContestHeaderTab from '~/components/ContestHeaderTab.vue'
import MathJax from '~/mixins/mathjax'
import MixinContest from '~/mixins/contest'
import SubmitTable from '~/components/submits/SubmitTable.vue'
import { HttpError } from '~/utils/axios'
import { SubmissionResponse } from '~/apis/Contests'
@Component({
  components: { SubmitTable, ContestHeaderTab, ContestHeader },
  layout: 'contest',
  middleware: 'authenticated'
})
export default class PageContest extends mixins(MathJax, MixinContest) {
  head() {
    return {
      title: `自分の提出 - ${this.contest?.name}`,
      titleTemplate: null
    }
  }

  submits: SubmissionResponse | null = null
  timeout: number = 15000

  async apiCall(
    page: number,
    count: number,
    sortBy: string[],
    sortDesc: boolean[],
    filter: [string, string | string[]][]
  ) {
    return await this.$api.Contests.mySubmits(
      this.$route.params.contestName,
      page,
      count,
      sortBy,
      sortDesc,
      filter
    )
      .then((res) => {
        this.timeout = res.data.some(
          (s) => s.judgeStatus || ['WJ', 'WR', 'IC'].includes(s.status)
        )
          ? 2000
          : 15000
        return res
      })
      .catch((err: Error) => {
        if (err.message === 'Not logged in.') this.$router.replace('/login')
      })
  }

  async rejudge(submitIds: number[]) {
    await this.$api.Contests.rejudge(this.contest!.slug, submitIds)
      .then(this.reload)
      .catch((err: HttpError) => {
        alert(
          err.response?.data.error || 'リジャッジのリクエストに失敗しました'
        )
      })
  }
}
</script>

<style lang="scss" scoped>
.submit-card {
  @include card-text-reset();
}
</style>
