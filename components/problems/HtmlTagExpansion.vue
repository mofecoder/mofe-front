<script setup lang="ts"></script>

<template>
  <v-expansion-panels>
    <v-expansion-panel title="HTML タグについて">
      <template #text>
        <p>
          問題文は原則として Markdown
          で記載してください。以下のタグは使用してもかまいませんが、それ以外のタグを利用したい場合は運営に相談してください。
        </p>
        <p><code>class</code>, <code>id</code> 属性は使用しないでください。</p>
        <ul>
          <li><code>details</code>, <code>summary</code> タグ（展開機能）</li>
          <li><code>img</code> タグ（画像表示）</li>
          <li>
            <code>ruby</code>, <code>rt</code>, <code>rp</code> タグ（ふりがな）
          </li>
          <li>
            <code>table</code>, <code>caption</code>, <code>col</code>,
            <code>colgroup</code>, <code>thead</code>, <code>tbody</code>,
            <code>tr</code>, <code>th</code>, <code>td</code>タグ（Markdown
            では表現できない表を作る場合）
          </li>
          <li>
            <code>p</code> タグ、<code>span</code> タグ、<code>div</code>
            タグ（<code>style</code>属性を利用する場合に限る）
          </li>
        </ul>
      </template>
    </v-expansion-panel>
  </v-expansion-panels>
</template>
<style scoped lang="scss"></style>
