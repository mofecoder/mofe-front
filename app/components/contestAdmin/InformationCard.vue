<template>
  <v-card :loading="loading">
    <v-card-title> コンテスト情報 </v-card-title>
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
            :disabled="edit"
          />
        </v-col>
        <v-col cols="12" sm="6" lg="3">
          <v-text-field
            v-model="penaltyTime"
            type="number"
            :rules="[...rules.notEmpty, rules.penalty]"
            label="ペナルティ"
            :suffix="edit == null ? '分' : '秒'"
          />
        </v-col>
        <v-col cols="12" lg="4">
          <v-select v-model="kindData" :items="kinds" label="種類" />
        </v-col>
      </v-row>
      <v-row justify="end">
        <v-btn
          class="mr-3"
          text
          width="auto"
          color="purple"
          @click="show = true"
          >プレビュー</v-btn
        >
      </v-row>
      <v-row>
        <v-col class="pt-0" cols="12">
          <v-textarea
            v-model="descriptionData"
            label="コンテスト詳細 (Markdown)"
            outlined
          />
          <MarkdownPreviewModal
            :markdown="descriptionData"
            title="コンテスト詳細 プレビュー"
            :value="show"
            @close="show = false"
          />
        </v-col>
      </v-row>
      <p v-if="edit == null" class="mt-4 mb-0">
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
          color="orange darken-3 white--text"
          block
          :disabled="loading"
          @click="submit"
          >更新する</v-btn
        >
      </template>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Vue, PropSync, Component, Prop, Emit } from 'nuxt-property-decorator'
import MarkdownPreviewModal from '~/components/modals/MarkdownPreviewModal.vue'
import { Contest, KIND_TABLE } from '~/types/contest'

const URL_REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/

@Component({
  components: { MarkdownPreviewModal }
})
export default class ContestInformationCard extends Vue {
  @PropSync('name', { required: true })
  contestName!: string

  @PropSync('slug', { required: true })
  contestSlug!: string

  @PropSync('penalty', { required: true })
  penaltyTime!: string

  @PropSync('description', { required: true })
  descriptionData!: string

  @PropSync('kind', { required: true })
  kindData!: Contest['kind']

  @PropSync('editorialUrl')
  editorial?: string

  @Prop()
  edit?: boolean

  @Prop()
  loading?: boolean

  show = false

  rules = {
    notEmpty: [
      (text: string) => /\S+/.test(text) || 'このフィールドは必須です'
    ],
    slug: [
      (text: string) =>
        (/^[a-z0-9_]+$/.test(text) && text !== 'new') ||
        "Slug は英小文字, 数字, '_' で構成される必要があります"
    ],
    penalty: (s: string): string | boolean => {
      const num = Number(s)
      return (
        (!isNaN(num) && num >= 0 && num <= 24 * 60) ||
        '0分以上24時間以下にしてください'
      )
    },
    url: [
      (text: string) =>
        !text || URL_REGEX.test(text) || 'URL を入力してください'
    ]
  }

  get kinds() {
    return Object.entries(KIND_TABLE).map((kv) => ({
      value: kv[0],
      text: kv[1]
    }))
  }

  @Emit()
  submit() {}
}
</script>

<style scoped></style>
