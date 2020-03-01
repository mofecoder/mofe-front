<template>
  <v-card class="wrapper">
    <v-card-title class="headline">問題の作成</v-card-title>
    <v-card-text>
      <v-form v-model="valid" @submit.prevent="onSubmit">
        <v-row>
          <v-col cols="12" class="py-1">
            <v-text-field
              v-model="content.title"
              :rules="rules.required"
              label="タイトル"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="4" class="py-1">
            <v-text-field
              v-model="content.point"
              :rules="rules.point"
              label="配点"
            />
          </v-col>
          <v-col cols="8" class="py-1">
            <v-select
              v-model="content.difficulty"
              :items="difficulties"
              label="難易度"
            />
          </v-col>
        </v-row>
        <!-- 問題文 -->
        <v-row justify="end">
          <v-btn
            style="margin-right:12px"
            text
            width="auto"
            color="purple"
            @click="modals.problemStatement = true"
            >プレビュー</v-btn
          >
        </v-row>
        <v-row>
          <v-col cols="12" class="pt-0 pb-2">
            <v-textarea
              v-model="content.problemStatement"
              :rules="rules.required"
              label="問題文"
              outlined
              auto-grow
            />
          </v-col>
        </v-row>
        <markdown-preview-modal
          title="プレビュー - 問題文"
          :markdown="content.problemStatement"
          :value="modals.problemStatement"
          @close="modals.problemStatement = false"
        />
        <!-- 制約 -->
        <v-row justify="end">
          <v-btn
            style="margin-right:12px"
            text
            width="auto"
            color="purple"
            @click="modals.constraints = true"
            >プレビュー</v-btn
          >
        </v-row>
        <v-row>
          <v-col cols="12" class="pt-0 pb-2">
            <v-textarea
              v-model="content.constraints"
              :rules="rules.required"
              label="制約"
              outlined
              auto-grow
            />
          </v-col>
        </v-row>
        <markdown-preview-modal
          title="プレビュー - 制約"
          :markdown="content.constraints"
          :value="modals.constraints"
          @close="modals.constraints = false"
        />
        <!-- 入力 -->
        <v-row justify="end">
          <v-btn
            style="margin-right:12px"
            text
            width="auto"
            color="purple"
            @click="modals.input = true"
            >プレビュー</v-btn
          >
        </v-row>
        <v-row>
          <v-col cols="12" class="pt-0 pb-2">
            <v-textarea
              v-model="content.input"
              :rules="rules.required"
              label="入力"
              outlined
              auto-grow
            />
          </v-col>
        </v-row>
        <markdown-preview-modal
          title="プレビュー - 入力"
          :markdown="content.input"
          :value="modals.input"
          @close="modals.input = false"
        />
        <!-- 出力 -->
        <v-row justify="end">
          <v-btn
            style="margin-right:12px"
            text
            width="auto"
            color="purple"
            @click="modals.output = true"
            >プレビュー</v-btn
          >
        </v-row>
        <v-row>
          <v-col cols="12" class="pt-0 pb-2">
            <v-textarea
              v-model="content.output"
              :rules="rules.required"
              label="出力"
              outlined
              auto-grow
            />
          </v-col>
        </v-row>
        <markdown-preview-modal
          title="プレビュー - 出力"
          :markdown="content.output"
          :value="modals.output"
          @close="modals.output = false"
        />
        <!-- サンプル -->
        <!-- 登録ボタン -->
        <v-row>
          <v-col cols="12">
            <v-btn :disabled="!valid" color="primary" type="submit" block>
              登録
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { Difficulty } from '~/types/problem'
import MarkdownPreviewModal from '~/components/modals/MarkdownPreviewModal.vue'

@Component({
  components: { MarkdownPreviewModal }
})
export default class CreateProblemCard extends Vue {
  rules = {
    point: [
      (text: string) =>
        /^\d{2,4}$/.test(text) || '2 - 4 桁の整数で入力してください'
    ],
    required: [(text: string) => /\S+/.test(text) || 'このフィールドは必須です']
  }

  difficulties: Difficulty[] = [
    'Milk',
    'Assam',
    'Benihuki',
    'Ceylon',
    'Darjeeling',
    'Earlgray',
    'Flavor',
    'ผักชี'
  ]

  content: {
    difficulty: Difficulty
    output: string
    input: string
    problemStatement: string
    title: string
    constraints: string
    point: number
  } = {
    title: '',
    point: 100,
    difficulty: 'Milk',
    problemStatement: '',
    constraints: '',
    input: '',
    output: ''
  }

  modals = {
    problemStatement: false,
    constraints: false,
    input: false,
    output: false
  }

  valid = false

  onSubmit() {
    // API
  }
}
</script>
