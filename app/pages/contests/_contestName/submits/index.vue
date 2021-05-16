<template>
  <div>
    <template v-if="contest">
      <v-container class="pa-0" fluid>
        <v-card :loading="!submits">
          <v-card-title>自分の提出</v-card-title>
          <v-card-text class="submit-card">
            <SubmitTable
              v-if="submits"
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
import { Submit } from '~/types/submits'
import { HttpError } from '~/utils/axios'
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

  async fetch() {
    await this.getContest()
    this.reload()
  }

  beforeDestroy() {
    if (this.timeout) window.clearTimeout(this.timeout)
    super.beforeDestroy()
  }

  submits: Submit[] | null = null
  timeout: number | null = null

  reload() {
    this.$api.Contests.mySubmits(this.$route.params.contestName)
      .then((res: Submit[]) => {
        this.submits = res
        const timeout = this.submits.some((s) => s.point == null) ? 2000 : 15000
        this.timeout = window.setTimeout(this.reload, timeout)
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
