<script setup lang="ts">
import languages from '~/constants/languages'
import type { TaskDetail } from '~/types/task'
import type { ProblemDetail } from '~/types/problems'

const props = defineProps<{
  contestSlug?: string
  id: number | null
  problem: ProblemDetail | TaskDetail
}>()

const language = ref(languages[0])

onMounted(() => {
  if (import.meta.client) {
    language.value =
      languages.filter(
        (lang) => localStorage.getItem('lang') === lang.innerName
      )[0] || languages[0]
  }
})

const timeLimit = computed(() => {
  const limit = props.problem.executionTimeLimit
  if (limit % 100 == 0) return [limit / 1000, 's', '秒']
  return [limit, 'ms', 'ミリ秒']
})

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
        <section v-if="problem.partialScores !== null">
          <h3>部分点</h3>
          <MarkdownContent
            class="statement"
            :markdown="problem.partialScores"
          />
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
              <div class="sample-head lb">
                <div class="sample-head__title">入力例 {{ index + 1 }}</div>
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
              <div class="sample-head">
                <div class="sample-head__title">出力例 {{ index + 1 }}</div>
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
      </v-card-text>
    </template>
  </v-card>
</template>

<style scoped lang="scss">
@use '@/styles/markdown';
@use '@/styles/variables';
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

  @include markdown.markdown();
}
.sample {
  border-top: solid 1px #e8e8e8;
  padding-top: 8px;

  &__code {
    @include variables.block-code();
  }

  .__editor {
    margin: 1em;
  }
}

.sample-head {
  display: flex;
  justify-content: space-between;

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
</style>
