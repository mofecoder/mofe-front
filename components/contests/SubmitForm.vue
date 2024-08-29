<script setup lang="ts">
import { FetchError } from 'ofetch'
import languages from '~/constants/languages'
import Tasks from '~/utils/apis/Tasks'
import type { ProblemDetail } from '~/types/problems'
import type { TaskDetail } from '~/types/task'

const props = defineProps<{
  contestSlug: string
  problem: ProblemDetail | TaskDetail
}>()

const router = useRouter()

const submitted = ref(false)
const sourceFileText = ref<string | null>(null)
const source = ref('')
const language = ref(languages[0])
const error = ref<string | null>(null)

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

async function submit() {
  if (!('position' in props.problem)) return

  const sourceCode = source.value || sourceFileText.value || ''
  if (!/\S/.test(sourceCode)) {
    alert('空のソースは提出できません。')
    return
  }
  if (import.meta.client) {
    localStorage.setItem('lang', language.value!.innerName)
  }
  submitted.value = true
  try {
    await api(
      Tasks.submit,
      {
        contestSlug: props.contestSlug,
        taskSlug: props.problem.slug,
        lang: language.value!.innerName
      },
      {
        headers: { 'Content-Type': 'text/plain' },
        query: { lang: language.value!.innerName }
      },
      sourceCode
    )
    await router.push(`/contests/${props.contestSlug}/submissions/me`)
  } catch (err) {
    if (err instanceof FetchError && err.status === 425) {
      error.value = err.data?.error
    } else {
      alert(`提出に失敗しました。`)
      console.error(err)
    }
    submitted.value = false
  }
}
</script>

<template>
  <v-alert v-if="error" class="mb-6" variant="tonal" type="error">{{
    error
  }}</v-alert>
  <div class="submit-head justify-start">
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
    <CodeEditor v-model="source" class="submit__editor" :language="language" />
  </ClientOnly>
  <v-file-input label="ソースファイルを選択" @change="onFileInputChange" />
  <v-btn
    color="primary"
    class="mt-2"
    :loading="submitted"
    :disabled="!language"
    prepend-icon="mdi-file-upload"
    @click="submit"
  >
    提出
  </v-btn>
</template>

<style scoped lang="scss">
.submit-head {
  display: flex;

  &__title {
    display: flex;
    align-items: center;
    font-size: 1.45rem;
    font-weight: bold;
    margin-right: 1rem;
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
