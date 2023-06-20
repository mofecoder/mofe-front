<script setup lang="ts">
const format =
  '- zipfile.zip\n' +
  '  - input\n    - testcase1.txt\n    - testcase2.txt\n' +
  '  - output\n    - testcase1.txt\n    - testcase2.txt'
</script>

<template>
  <v-expansion-panel title="アップロードの方法">
    <template #text>
      <p>テストケースを zip 形式でアップロードすることができます。</p>
      <p>以下のフォーマットのZIPファイルをアップロードしてください。</p>
      <v-row justify="start">
        <v-col cols="12" md="6">
          <pre><code class="format" v-text="format" /></pre>
        </v-col>
        <v-col cols="12" md="6">
          <p>
            ※ ZIPファイルとテストケースの名前は任意です。 input / output
            の同じファイル名のものが同一のテストケースとして扱われます。
          </p>
          <p>
            ※
            <code>dir.zip/dir/input/name.txt</code>
            のような構造にならないように注意してください。
          </p>
          <p>
            ※ ファイル名は半角英数と半角アンダーバーで構成され、 txt
            形式である必要があります。
          </p>
        </v-col>
      </v-row>
    </template>
  </v-expansion-panel>
</template>

<style scoped lang="scss">
.format {
  width: 100%;
  color: black;
}
</style>
