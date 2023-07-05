<script setup lang="ts">
import languages from '~/constants/languages'
import { TaskDetail } from '~/types/task'
import { useUserStore } from '~/store/user'
import { MarkdownIt } from '~/types/plugins'
import Tasks from '~/utils/apis/Tasks'
import { ProblemDetail } from '~/types/problems'

const props = defineProps<{
  contestSlug?: string
  id: number | null
  problem: ProblemDetail | TaskDetail
}>()

const language = ref(languages[0])
const submitted = ref(false)
const sourceFileText = ref<string | null>(null)

onMounted(() => {
  if (process.client) {
    language.value =
      languages.filter(
        (lang) => localStorage.getItem('lang') === lang.innerName
      )[0] || languages[0]
  }
})

function onFileInputChange(file: File) {
  const reader = new FileReader()
  reader.onload = () => {
    if (file.name.endsWith('.sb3')) {
      const converter = new Sb3ToCppConverter()
      converter
        .convertFromZip(file)
        .then((text) => {
          sourceFileText.value = text
        })
        .catch((e) => {
          alert(`Scratch3 プロジェクトを変換中にエラーが発生しました\n${e}`)
        })
    } else {
      sourceFileText.value = reader.result?.toString() || null
    }
  }

  reader.readAsText(file)
}

const timeLimit = computed(() => {
  const limit = props.problem.executionTimeLimit
  if (limit % 100 == 0) return `${limit} ms`
  return `${limit / 1000} s`
})
const $md: MarkdownIt = useNuxtApp().$md

const { user } = toRefs(useUserStore())

const selectableLanguages = languages
  .filter((lang) => !lang.isOutdated)
  .map((lang) => ({
    title: lang.name,
    value: lang
  }))

function langFilter(value: string, queryText: string) {
  function toHalf(str: string): string {
    const offset = 'Ａ'.charCodeAt(0) - 'A'.charCodeAt(0)
    return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, (s) =>
      String.fromCharCode(s.charCodeAt(0) - offset)
    )
  }

  return value.toLowerCase().includes(toHalf(queryText).toLowerCase())
}

const { contestName } = useContest()

const source = ref('')
const router = useRouter()

async function submit() {
  if (!contestName) return
  if (!('position' in props.problem)) return

  const sourceCode = source.value || sourceFileText.value || ''
  if (!/\S/.test(sourceCode)) {
    alert('空のソースは提出できません。')
    return
  }
  if (process.client) {
    localStorage.setItem('lang', language.value!.innerName)
  }
  submitted.value = true
  await useApi(
    Tasks.submit,
    {
      contestSlug: contestName.value,
      taskSlug: props.problem.slug,
      lang: language.value!.innerName
    },
    {},
    { source: sourceCode }
  )
    .then((res) => {
      if (res.error.value) {
        throw res.error
      }
      router.push(`/contests/${contestName.value}/submissions`)
    })
    .catch(() => {
      alert(`提出に失敗しました。`)
      submitted.value = false
    })
}

const title = computed(() => {
  if ('position' in props.problem) {
    return `${props.problem.position} - ${props.problem.name}`
  } else {
    return props.problem.name
  }
})
</script>

<template>
  <v-card class="mx-auto" max-width="800px" :loading="!problem">
    <template v-if="problem">
      <v-card-title class="task-card-title">
        <h2 class="d-flex">
          {{ title }}
          <v-spacer />
          <v-btn
            v-if="id"
            color="purple white--text"
            :to="`/manage/problems/${id}`"
            density="compact"
            >問題の編集画面へ</v-btn
          >
        </h2>
        <ProblemsDifficultyChip :difficulty="problem.difficulty" />
        <p class="task-time-limit mb-0">実行時間制限: {{ timeLimit }}</p>
        <p
          v-if="'points' in problem && problem.points != null"
          class="task-points"
        >
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
            <v-btn
              color="blue-lighten-4"
              size="small"
              @click="copy(sample.input)"
              >コピー</v-btn
            >
          </div>
          <div class="statement">
            <code class="sample__code" v-html="sample.input" />
          </div>
          <div class="submit-head">
            <div class="submit-head__title">出力例 {{ index + 1 }}</div>
            <v-btn
              color="blue-lighten-4"
              size="small"
              @click="copy(sample.output)"
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
        <section v-if="user && contestSlug">
          <div class="submit-head">
            <div class="submit-head__title">提出</div>
            <v-autocomplete
              v-model="language"
              class="submit-head__select"
              :items="selectableLanguages"
              label="提出する言語"
              :custom-filter="langFilter"
              hide-details
              variant="outlined"
              density="compact"
            />
            <v-tooltip
              v-if="language"
              location="top"
              :text="`&quot;${language.name}&quot; のコンパイル・実行コマンド等の情報`"
            >
              <template #activator="{ props: p }">
                <v-btn
                  v-bind="p"
                  icon
                  variant="text"
                  target="_blank"
                  :to="`/languages?lang=${language.innerName}`"
                >
                  <v-icon color="secondary">mdi-information-outline</v-icon>
                </v-btn>
              </template>
            </v-tooltip>
          </div>
          <ClientOnly>
            <CodeEditor
              v-model="source"
              class="submit__editor"
              :language="language"
            />
          </ClientOnly>
          <v-file-input
            label="ソースファイルを選択"
            @change="onFileInputChange"
          />
          <v-btn
            color="primary"
            class="mt-2"
            :loading="submitted"
            :disabled="!language"
            @click="submit"
          >
            提出する
          </v-btn>
        </section>
      </v-card-text>
    </template>
  </v-card>
</template>

<style scoped lang="scss">
@import 'styles/markdown';
@import 'styles/variables';
h2 {
  font-size: 3rem;
}

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
    font-size: 1.7em;
    margin: {
      top: 0.3em;
      bottom: 0.5em;
    }
  }
}

.statement {
  margin: 1em 0 2em 1.5em;
  font-size: 1.15em;

  @include markdown();
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
