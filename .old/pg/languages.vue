<template>
  <div>
    <p>CafeCoder で利用できる言語のコンパイルコマンド・導入ライブラリなど</p>
    <v-expansion-panels v-model="selected">
      <v-expansion-panel v-for="lang in languages" :key="lang.innerName">
        <v-expansion-panel-header>{{ lang.name }}</v-expansion-panel-header>
        <v-expansion-panel-content>
          <p>コンパイルコマンド：<code v-text="lang.compilationCommand" /></p>
          <p>実行コマンド：<code v-text="lang.runCommand" /></p>
          <template v-if="lang.libraries">
            <p>ライブラリ：<span v-html="lang.libraries" /></p>
          </template>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator'
import languages from '~/constants/languages'

@Component
export default class PageLanguage extends Vue {
  languages = languages.filter((lang) => !lang.isOutdated)

  selected: number | null = null

  @Watch('$route.query.lang', { immediate: true })
  onChangeQuery(value: string | unknown[]) {
    if (typeof value !== 'string') return
    const index = this.languages.findIndex((lang) => lang.innerName === value)
    this.selected = index === -1 ? null : index
  }
}
</script>

<style scoped lang="scss"></style>
