<template>
  <div>
    <div v-if="contest">
      <ContestHeader :name="contest.name" />
      <v-container class="pa-0" fluid>
        <ContestHeaderTab />
        <v-card v-if="problem">
          <v-card-title>{{ problem.name }}</v-card-title>
          <v-card-text style="color:inherit">
            <h3>問題文</h3>
            <div class="statements" v-html="$md.render(problem.statement)" />
            <h3>制約</h3>
            <div class="statements" v-html="$md.render(problem.constraints)" />
            <h3>入力</h3>
            <div class="statements" v-html="$md.render(problem.inputFormat)" />
            <h3>出力</h3>
            <div class="statements" v-html="$md.render(problem.outputFormat)" />
          </v-card-text>
        </v-card>
      </v-container>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import ContestHeaderTab from '~/components/ContestHeaderTab.vue'
import ContestHeader from '~/components/ContestHeader.vue'
import { ProblemDetail } from '~/types/problem'
import { Contest } from '~/types/contest'
import MathJax from '~/mixins/mathjax'

@Component({
  components: {
    ContestHeader,
    ContestHeaderTab
  }
})
export default class PageContestTasks extends mixins(MathJax) {
  problem: ProblemDetail | null = null
  contest: Contest | null = null

  async mounted() {
    this.contest = await this.$api.Contests.index(
      this.$route.params.contestName
    )
    this.problem = await this.$api.Problems.show(
      this.$route.params.contestName,
      this.$route.params.taskName
    )
    this.$nextTick(() => {
      this.renderMathJax()
    })
  }
}
</script>

<style scoped lang="scss">
.statements {
  margin: 1em 0 2em 1.5em;
  font-size: 1.15em;
}
h3 {
  font-size: 1.4em;
}
</style>

<style lang="scss">
@import '~/styles/markdown.scss';
.statements {
  @include markdown();
}
</style>
