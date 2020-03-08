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
              <div class="statement" v-html="$md.render(problem.statement)" />
            </section>
            <section>
              <h3>制約</h3>
              <div class="statement" v-html="$md.render(problem.constraints)" />
            </section>
            <section>
              <h3>入力</h3>
              <div class="statement" v-html="$md.render(problem.inputFormat)" />
            </section>
            <section>
              <h3>出力</h3>
              <div
                class="statement"
                v-html="$md.render(problem.outputFormat)"
              />
            </section>
            <section v-for="(sample, index) in problem.samples" :key="index">
              <div class="sample__head">
                <div class="sample__head__title">入力例 {{ index + 1 }}</div>
                <v-btn color="blue lighten-4" small @click="copy(sample.input)"
                  >コピー</v-btn
                >
              </div>
              <div class="statement">
                <code class="sample__code" v-html="sample.input" />
              </div>
              <div class="sample__head">
                <div class="sample__head__title">出力例 {{ index + 1 }}</div>
                <v-btn color="blue lighten-4" small @click="copy(sample.output)"
                  >コピー</v-btn
                >
              </div>
              <div class="statement">
                <code class="sample__code" v-html="sample.output" />
              </div>
              <div
                v-if="sample.explanation"
                class="statement"
                v-html="$md.render(sample.explanation)"
              />
            </section>
            <section>
              <h3>提出</h3>
              <Editor ref="editor" class="editor" />
              <v-btn color="primary" @click="submit">
                提出する
              </v-btn>
            </section>
          </v-card-text>
        </v-card>
      </v-container>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, mixins, Vue } from 'nuxt-property-decorator'
import ContestHeaderTab from '~/components/ContestHeaderTab.vue'
import ContestHeader from '~/components/ContestHeader.vue'
import { ProblemDetail } from '~/types/problem'
import MathJax from '~/mixins/mathjax'
import MixinContest from '~/mixins/contest'
import DifficultyChip from '~/components/parts/difficulty-chip.vue'
import Editor from '~/components/Editor.vue'

@Component({
  components: {
    DifficultyChip,
    ContestHeader,
    ContestHeaderTab,
    Editor
  },
  layout: 'contest'
})
export default class PageContestTasks extends mixins(MathJax, MixinContest) {
  problem: ProblemDetail | null = null

  copy(text: string) {
    const tmp = document.createElement('textarea')
    tmp.style.position = 'fixed'
    tmp.style.right = '200%'
    tmp.textContent = text
    document.body.appendChild(tmp)
    tmp.select()
    document.execCommand('copy')
    document.body.removeChild(tmp)
  }

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

  get source(): string {
    const editor = this.$refs.editor as Vue & {
      value: string
    }
    return editor.value
  }

  submit() {
    // console.log(this.source)
  }
}
</script>

<style scoped lang="scss">
.statement {
  margin: 1em 0 2em 1.5em;
  font-size: 1.15em;
}
.sample {
  &__head {
    display: flex;
    &__title {
      display: flex;
      align-items: center;
      font-size: 1.45rem;
      font-weight: bold;
      margin-right: 1rem;
    }
  }
  &__code {
    width: 100%;
    color: black;
    padding: 0.5em;
    margin: 0;
    font-size: 1em;
    font-weight: normal;
    &:before,
    &:after {
      content: none;
    }
  }
}
h3 {
  font-size: 1.5rem;
}
.editor {
  margin: 1em;
}
</style>

<style lang="scss">
@import '~/styles/markdown.scss';
.statement {
  @include markdown();
}
</style>
