<script setup lang="ts">
import languages from '~/constants/languages'
import type { TaskDetail } from '~/types/task'
import { useUserStore } from '~/store/user'
import Tasks from '~/utils/apis/Tasks'
import type { ProblemDetail } from '~/types/problems'

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
  if (limit % 100 == 0) return [limit / 1000, 's', '秒']
  return [limit, 'ms', 'ミリ秒']
})

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
    {
      headers: {
        'Content-Type': 'text/plain'
      }
    },
    sourceCode
  )
    .then((res) => {
      if (res.error.value) {
        throw res.error
      }
      router.push(`/contests/${contestName.value}/submissions/me`)
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
  <v-card class="mx-auto" max-width="1200px" :loading="!problem">
    <template v-if="problem">
      <v-card-title class="task-card-title">
        <h2 class="d-flex">
          {{ title }}
        </h2>
        <v-btn
          v-if="id"
          color="purple white--text"
          class="mb-4"
          :to="`/manage/problems/${id}`"
          variant="tonal"
          density="comfortable"
          prepend-icon="mdi-note-edit-outline"
        >
          問題の編集画面へ
        </v-btn>
        <div class="d-flex flex-wrap">
          <ProblemsDifficultyChip
            class="p-tooltip-0"
            :difficulty="problem.difficulty"
          />
          <v-spacer />
          <v-tooltip
            location="bottom"
            :text="`実行時間制限 ${timeLimit[0]} ${timeLimit[2]}`"
          >
            <template #activator="{ props: p }">
              <v-chip
                class="p-tooltip"
                v-bind="p"
                variant="tonal"
                size="large"
                color="orange"
                prepend-icon="mdi-timer"
              >
                <span class="text-orange-darken-3">
                  {{ timeLimit[0] }}
                </span>
                <template #append>
                  <span class="chip-sub">{{ timeLimit[1] }}</span>
                </template>
              </v-chip>
            </template>
          </v-tooltip>
          <v-tooltip location="bottom" :text="`メモリ制限 1024 MB`">
            <template #activator="{ props: p }">
              <v-chip
                class="ml-3 p-tooltip"
                v-bind="p"
                variant="tonal"
                size="large"
                color="teal"
                prepend-icon="mdi-memory"
              >
                <span class="text-teal-darken-3">1024</span>
                <template #append>
                  <span class="chip-sub">MB</span>
                </template>
              </v-chip>
            </template>
          </v-tooltip>
          <v-tooltip
            v-if="'points' in problem"
            location="bottom"
            :text="`配点 ${problem.points} 点`"
          >
            <template #activator="{ props: p }">
              <v-chip
                class="ml-3 p-tooltip"
                v-bind="p"
                variant="tonal"
                size="large"
                color="indigo"
                prepend-icon="mdi-check-circle"
              >
                <span class="text-indigo-darken-3">{{ problem.points }}</span>
                <template #append>
                  <span class="chip-sub">点</span>
                </template>
              </v-chip>
            </template>
          </v-tooltip>
          <v-chip
            v-else
            class="ml-3 p-tooltip"
            variant="tonal"
            size="large"
            color="indigo"
            prepend-icon="mdi-check-circle"
          >
            <span class="text-indigo-darken-3">---</span>
            <template #append>
              <span class="chip-sub">点</span>
            </template>
          </v-chip>
        </div>
      </v-card-title>
      <v-card-text class="mt-3 task-card-text">
        <section>
          <h3>問題文</h3>
          <MarkdownContent class="statement" :markdown="problem.statement" />
        </section>
        <section>
          <h3>制約</h3>
          <MarkdownContent class="statement" :markdown="problem.constraints" />
        </section>
        <section>
          <h3>入力</h3>
          <MarkdownContent class="statement" :markdown="problem.inputFormat" />
        </section>
        <section>
          <h3>出力</h3>
          <MarkdownContent class="statement" :markdown="problem.outputFormat" />
        </section>
        <v-container class="pa-0">
          <v-row
            v-for="(sample, index) in problem.samples"
            :key="index"
            class="sample"
            tag="section"
          >
            <v-col cols="12" xl="6" class="pb-0">
              <div class="submit-head lb">
                <div class="submit-head__title">入力例 {{ index + 1 }}</div>
                <v-btn
                  color="blue"
                  variant="tonal"
                  size="small"
                  prepend-icon="mdi-content-copy"
                  @click="copy(sample.input)"
                  >コピー</v-btn
                >
              </div>
              <div class="statement">
                <code class="sample__code" v-html="sample.input" />
              </div>
            </v-col>
            <v-col cols="12" xl="6">
              <div class="submit-head">
                <div class="submit-head__title">出力例 {{ index + 1 }}</div>
                <v-btn
                  color="blue"
                  variant="tonal"
                  size="small"
                  prepend-icon="mdi-content-copy"
                  @click="copy(sample.output)"
                  >コピー</v-btn
                >
              </div>
              <div class="statement">
                <code class="sample__code" v-html="sample.output" />
              </div>
              <MarkdownContent
                v-if="sample.explanation"
                :markdown="sample.explanation"
                class="statement"
              />
            </v-col>
          </v-row>
        </v-container>
        <section v-if="user && contestSlug">
          <div class="submit-head justify-start">
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
                  icon="mdi-information-outline"
                  v-bind="p"
                  variant="text"
                  target="_blank"
                  :to="`/languages?lang=${language.innerName}`"
                />
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
            prepend-icon="mdi-file-upload"
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

.statement,
.problem-text {
  color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
}

.task-time-limit,
.task-points {
  font-size: 1rem;
}

.chip-sub {
  margin-left: 4px;
  font-size: 0.85rem;
  vertical-align: bottom;
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
  border-top: solid 1px #e8e8e8;
  padding-top: 8px;

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
  justify-content: space-between;

  &__title {
    @extend .sample-head__title;
  }

  &__select {
    max-width: 20em;
  }
}

.p-tooltip {
  order: 1;
  &-0 {
    order: 0;
  }
}
</style>
