<template>
  <div>
    <div v-if="contest">
      <v-container class="pa-0" fluid>
        <v-card v-if="problem" class="mx-auto" max-width="800px">
          <v-card-title class="mb-3">
            <p style="width:100%">{{ problem.position }}: {{ problem.name }}</p>
            <DifficultyChip :difficulty="problem.difficulty" />
          </v-card-title>
          <v-card-text style="color:inherit">
            <section>
              <h3>問題文</h3>
              <div class="statements" v-html="$md.render(problem.statement)" />
            </section>
            <section>
              <h3>制約</h3>
              <div
                class="statements"
                v-html="$md.render(problem.constraints)"
              />
            </section>
            <section>
              <h3>入力</h3>
              <div
                class="statements"
                v-html="$md.render(problem.inputFormat)"
              />
            </section>
            <section>
              <h3>出力</h3>
              <div
                class="statements"
                v-html="$md.render(problem.outputFormat)"
              />
            </section>
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
import MathJax from '~/mixins/mathjax'
import MixinContest from '~/mixins/contest'
import DifficultyChip from '~/components/parts/difficulty-chip.vue'

@Component({
  components: {
    DifficultyChip,
    ContestHeader,
    ContestHeaderTab
  },
  layout: 'contest'
})
export default class PageContestTasks extends mixins(MathJax, MixinContest) {
  problem: ProblemDetail | null = null

  created() {
    this.getContest()
    this.$api.Problems.show(
      this.$route.params.contestName,
      this.$route.params.taskName
    ).then((ret: ProblemDetail) => {
      this.problem = ret
      this.$nextTick(() => {
        this.renderMathJax()
      })
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
