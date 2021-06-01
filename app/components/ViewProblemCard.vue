<template>
  <v-card class="mx-auto" max-width="800px" :loading="!problem">
    <template v-if="problem">
      <v-card-title class="task-card-title">
        <h2 class="d-flex">
          {{
            problem.position
              ? `${problem.position} - ${problem.name}`
              : problem.name
          }}
          <v-spacer />
          <v-btn
            v-if="id"
            color="purple white--text"
            link
            :to="`/writer/problems/${id}`"
            dense
            >問題の編集画面へ</v-btn
          >
        </h2>
        <DifficultyChip :difficulty="problem.difficulty" />
        <p class="task-time-limit mb-0">実行時間制限: {{ timeLimit }}</p>
        <p v-if="problem.points != null" class="task-points">
          配点: {{ problem.points }}
        </p>
      </v-card-title>
      <v-card-text class="mt-3 task-card-text">
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
          <div class="statement" v-html="$md.render(problem.outputFormat)" />
        </section>
        <section v-for="(sample, index) in problem.samples" :key="index">
          <div class="submit-head">
            <div class="submit-head__title">入力例 {{ index + 1 }}</div>
            <v-btn color="blue lighten-4" small @click="copy(sample.input)"
              >コピー</v-btn
            >
          </div>
          <div class="statement">
            <code class="sample__code" v-html="sample.input" />
          </div>
          <div class="submit-head">
            <div class="submit-head__title">出力例 {{ index + 1 }}</div>
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
        <section v-if="loggedIn && contestSlug">
          <div class="submit-head">
            <div class="submit-head__title">提出</div>
            <v-autocomplete
              v-model="language"
              class="submit-head__select"
              :items="selectableLanguages"
              label="提出する言語"
              :filter="langFilter"
              dense
              hide-details
              outlined
            />
            <v-tooltip top>
              <template #activator="{ on, attrs }">
                <v-btn
                  v-bind="attrs"
                  color="secondary"
                  icon
                  nuxt
                  target="_blank"
                  :to="`/languages?lang=${language.innerName}`"
                  v-on="on"
                >
                  <v-icon>mdi-information-outline</v-icon>
                </v-btn>
              </template>
              <span
                >"{{ language.name }}" のコンパイル・実行コマンド等の情報</span
              >
            </v-tooltip>
          </div>
          <Editor ref="editor" class="submit__editor" :language="language" />
          <v-btn
            color="primary"
            class="mt-2"
            :disabled="!language || submitted"
            @click="submit"
          >
            提出する
          </v-btn>
        </section>
      </v-card-text>
    </template>
  </v-card>
</template>

<script lang="ts">
import { Component, mixins, Prop, Vue } from 'nuxt-property-decorator'
import { ProblemDetail } from '~/types/problems'
import { TaskDetail } from '~/types/task'
import { Language } from '~/types/language'
import languages from '~/constants/languages'
import MathJax from '~/mixins/mathjax'
import DifficultyChip from '~/components/parts/difficulty-chip.vue'
import { userStore } from '~/utils/store-accessor'
import { copy } from '~/utils/clipboard'
import Editor from '~/components/Editor.vue'
@Component({
  components: {
    Editor,
    DifficultyChip
  }
})
export default class ViewProblemCard extends mixins(MathJax) {
  @Prop({ required: true })
  problem!: ProblemDetail | TaskDetail

  @Prop()
  contestSlug?: string

  @Prop({ required: false })
  id?: number

  language: Language = languages[0]
  submitted = false

  mounted() {
    this.$nextTick(() => this.renderMathJax())
  }

  created() {
    this.language =
      languages.filter(
        (lang) => localStorage.getItem('lang') === lang.innerName
      )[0] || languages[0]
  }

  get source(): string {
    const editor = this.$refs.editor as Vue & {
      value: string
    }
    return editor.value
  }

  get selectableLanguages() {
    return languages
      .filter((lang) => !lang.isOutdated)
      .map((lang) => ({
        text: lang.name,
        value: lang
      }))
  }

  copy(text: string) {
    copy(text)
  }

  langFilter(_: object, queryText: string, itemText: string) {
    function toHalf(str: string): string {
      const offset = 'Ａ'.charCodeAt(0) - 'A'.charCodeAt(0)
      return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) =>
        String.fromCharCode(s.charCodeAt(0) - offset)
      )
    }

    return itemText.toLowerCase().includes(toHalf(queryText).toLowerCase())
  }

  submit() {
    if (!this.contestSlug) return

    if (!/\S/.test(this.source)) {
      alert('空のソースは提出できません。')
      return
    }
    localStorage.setItem('lang', this.language!.innerName)
    this.submitted = true
    this.$api.Tasks.submit(
      this.contestSlug,
      this.$route.params.taskName,
      this.language!.innerName,
      this.source,
      'AC'
    )
      .then(() => {
        this.$router.push(`/contests/${this.contestSlug}/submits`)
      })
      .catch(() => {
        alert('提出に失敗しました。')
        this.submitted = false
      })
  }

  get timeLimit() {
    const limit = this.problem.executionTimeLimit
    if (limit % 1000) return `${limit} msec`
    return `${limit / 1000} sec`
  }

  get loggedIn() {
    return !!userStore.getUser
  }
}
</script>

<style scoped lang="scss">
@import '~/styles/markdown.scss';
h3 {
  font-size: 1.5rem;
}

.task-time-limit,
.task-points {
  font-size: 1rem;
}

.task-card-title {
  display: block !important;
  h2 {
    font-size: 1.3em;
  }
}

.task-card-text {
  color: inherit !important;
}

.statement {
  margin: 1em 0 2em 1.5em;
  font-size: 1.15em;

  ::v-deep {
    @include markdown();

    pre code {
      white-space: pre-wrap !important;
      margin-bottom: 1rem;
    }

    img {
      max-width: 100%;
    }
  }
}

.sample {
  &__code {
    @include block-code();
  }

  .__editor {
    margin: 1em;
  }
}

.sample-head {
  display: flex;
  &__title {
    display: flex;
    align-items: center;
    font-size: 1.45rem;
    font-weight: bold;
    margin-right: 1rem;
  }
}

.submit {
  &__editor {
    margin-top: 0.5rem;
  }
}

.submit-head {
  display: flex;

  &__title {
    @extend .sample-head__title;
  }

  &__select {
    max-width: 20em;
  }
}
</style>
