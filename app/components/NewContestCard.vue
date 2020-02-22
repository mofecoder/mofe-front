<template>
  <v-card>
    <v-card-title>
      コンテスト情報
    </v-card-title>
    <v-card-text>
      <v-text-field
        v-model="contestName"
        :rules="rules.notEmpty"
        label="コンテスト名"
        @change="inputTitle"
      />
      <v-text-field
        v-model="contestSlug"
        :rules="rules.slug"
        label="コンテスト ID (Slug)"
        @change="inputSlug"
      >
      </v-text-field>
      <p class="mt-4 mb-0">
        <strong>問題の追加はコンテスト管理画面から行ってください。</strong>
      </p>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Emit, Vue } from 'vue-property-decorator'

export default class NewContestCard extends Vue {
  contestName = ''
  contestSlug = ''
  rules = {
    notEmpty: [
      (text: string) => /\S+/.test(text) || 'このフィールドは必須です'
    ],
    slug: [
      (text: string) =>
        (/^[a-z0-9_]+$/.test(text) && text !== 'new') ||
        "Slug は英小文字, 数字, '_' で構成される必要があります"
    ]
  }

  @Emit()
  inputTitle() {
    return this.contestName
  }

  @Emit()
  inputSlug() {
    return this.contestSlug
  }
}
</script>

<style scoped></style>
