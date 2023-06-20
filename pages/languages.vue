<script setup lang="ts">
import languagesRaw from '~/constants/languages'

const languages = languagesRaw.filter((lang) => !lang.isOutdated)

const getIndex = () => {
  const index = languages.findIndex(
    (lang) => lang.innerName === route.query.lang
  )
  return index === -1 ? null : index
}
const route = useRoute()
const selected = ref<number | null>()

watch(
  () => route.query.lang,
  () => {
    selected.value = getIndex()
  },
  { immediate: true }
)
</script>

<template>
  <div>
    <p>CafeCoder で利用できる言語のコンパイルコマンド・導入ライブラリなど</p>
    <v-expansion-panels v-model="selected">
      <v-expansion-panel
        v-for="lang in languages"
        :key="lang.innerName"
        :title="lang.name"
      >
        <template #text>
          <p>コンパイルコマンド：<code v-text="lang.compilationCommand" /></p>
          <p>実行コマンド：<code v-text="lang.runCommand" /></p>
          <p v-if="lang.libraries">
            ライブラリ：<span v-html="lang.libraries" />
          </p>
        </template>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<style scoped lang="scss"></style>
