<script setup lang="ts">
import { Contest } from '~/types/contest'
import { KIND_TABLE } from '~/constants/contests'

const URL_REGEX =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/
const props = defineProps<{
  name: string
  slug: string
  penalty: string
  description: string
  kind: Contest['kind']
  editorialUrl?: string
  officialMode: boolean
  edit?: boolean
  loading?: boolean
}>()

const emits = defineEmits<{
  submit: []
  'update:name': [string]
  'update:slug': [string]
  'update:penalty': [string]
  'update:description': [string]
  'update:kind': [Contest['kind']]
  'update:editorialUrl': [string | null]
  'update:officialMode': [boolean]
}>()

const rules = {
  notEmpty: [(text: string) => /\S+/.test(text) || 'このフィールドは必須です'],
  slug: [
    (text: string) =>
      (/^[a-z0-9_]+$/.test(text) && text !== 'new') ||
      "Slug は英小文字, 数字, '_' で構成される必要があります"
  ],
  penalty: (s: string): string | boolean => {
    const num = Number(s)
    let max = 24 * 60
    if (props.edit) max *= 60
    return (
      (!isNaN(num) && num >= 0 && num <= max) ||
      '0分以上24時間以下にしてください'
    )
  },
  url: [
    (text: string) => !text || URL_REGEX.test(text) || 'URL を入力してください'
  ]
}

const kinds = Object.entries(KIND_TABLE).map((kv) => ({
  value: kv[0],
  title: kv[1]
}))

const preview = ref(false)

const contestName = computed({
  get: () => props.name,
  set: (v) => emits('update:name', v)
})

const contestSlug = computed({
  get: () => props.slug,
  set: (v) => emits('update:slug', v)
})

const penaltyTime = computed({
  get: () => props.penalty,
  set: (v) => emits('update:penalty', v)
})

const contestDescription = computed({
  get: () => props.description,
  set: (v) => emits('update:description', v)
})

const contestKind = computed({
  get: () => props.kind,
  set: (v) => emits('update:kind', v)
})

const editorial = computed({
  get: () => props.editorialUrl || null,
  set: (v) => emits('update:editorialUrl', v || null)
})

const official = computed({
  get: () => props.officialMode,
  set: (v) => emits('update:officialMode', v)
})
</script>

<template>
  <v-card :loading="loading">
    <v-card-title>コンテスト情報</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="contestName"
            :rules="rules.notEmpty"
            label="コンテスト名"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6" lg="5">
          <v-text-field
            v-model="contestSlug"
            class=""
            :rules="rules.slug"
            label="コンテスト ID (Slug)"
            :readonly="edit"
          />
        </v-col>
        <v-col cols="12" sm="6" lg="3">
          <v-text-field
            v-model="penaltyTime"
            type="number"
            :rules="[...rules.notEmpty, rules.penalty]"
            label="ペナルティ"
            :suffix="edit ? '秒' : '分'"
          />
        </v-col>
        <v-col cols="12" lg="4">
          <v-select v-model="contestKind" :items="kinds" label="種類" />
        </v-col>
      </v-row>
      <v-row justify="end">
        <v-btn
          class="mr-3"
          variant="text"
          width="auto"
          color="purple"
          @click="preview = true"
          >プレビュー</v-btn
        >
      </v-row>
      <v-row>
        <v-col class="pt-0" cols="12">
          <v-textarea
            v-model="contestDescription"
            label="コンテスト詳細 (Markdown)"
            variant="outlined"
          />
          <MarkdownPreviewModal
            :markdown="contestDescription"
            title="コンテスト詳細 プレビュー"
            :value="preview"
            @close="preview = false"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-checkbox
            v-model="official"
            label="公式コンテストモード"
            hint="コンテスト開始前でも writer / tester がすべての問題を閲覧できるようになります。"
            persistent-hint
          />
        </v-col>
      </v-row>
      <p v-if="!edit" class="mt-4 mb-0">
        <strong>問題の追加はコンテスト管理画面から行ってください。</strong>
      </p>
      <template v-else>
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="editorial"
              :rules="rules.url"
              label="解説の URL"
            />
          </v-col>
        </v-row>
        <v-btn
          color="orange-darken-3"
          block
          :disabled="loading"
          @click="emits('submit')"
          >更新する</v-btn
        >
        <v-row>
          <v-col cols="12">
            <h4>コンテスト管理者の管理</h4>
          </v-col>
        </v-row>
      </template>
    </v-card-text>
  </v-card>
</template>

<style scoped lang="scss"></style>
