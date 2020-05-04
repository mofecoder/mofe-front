<template>
  <v-expansion-panel>
    <v-expansion-panel-header>アップロードの方法</v-expansion-panel-header>
    <v-expansion-panel-content>
      <p>テストケースを zip 形式でアップロードすることができます。</p>
      <p>以下のフォーマットのZIPファイルをアップロードしてください。</p>
      <v-row justify="start">
        <v-col cols="12" sm="6">
          <pre><code class="format" v-text="format" /></pre>
        </v-col>
        <v-col cols="12" sm="6">
          <p>
            ※ ZIPファイルとテストケースの名前は任意です。 input / output
            の同じファイル名のものが同一のテストケースとして扱われます。
          </p>
          <p>
            ※
            <code>dir.zip/dir/input/name.txt</code>
            のような構造にならないように注意してください。
          </p>
        </v-col>
      </v-row>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class TestcaseUploadExpansionPanel extends Vue {
  readonly format =
    '- zipfile.zip\n' +
    '  - input\n    - testcase1.txt\n    - testcase2.txt\n' +
    '  - output\n    - testcase1.txt\n    - testcase2.txt'
}
</script>

<style scoped lang="scss">
.format {
  width: 100%;
  color: black;
}
</style>
