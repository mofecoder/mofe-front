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
        <v-row>
          <v-col cols="12" class="py-1">
            <v-textarea
              v-model="content.problemStatement"
              :rules="rules.required"
              label="問題文"
              outlined
              auto-grow
            />
          </v-col>
        </v-row>
        <!-- 制約 -->
        <v-row>
          <v-col cols="12" class="py-1">
            <v-textarea
              v-model="content.constraints"
              :rules="rules.required"
              label="制約"
              outlined
              auto-grow
            />
          </v-col>
        </v-row>
        <!-- 入力 -->
        <v-row>
          <v-col cols="12" class="py-1">
            <v-textarea
              v-model="content.input"
              :rules="rules.required"
              label="入力"
              outlined
              auto-grow
            />
          </v-col>
        </v-row>
        <!-- 出力 -->
        <v-row>
          <v-col cols="12" class="py-1">
            <v-textarea
              v-model="content.output"
              :rules="rules.required"
              label="出力"
              outlined
              auto-grow
            />
          </v-col>
        </v-row>
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
import { Vue, Component } from 'vue-property-decorator'
import { Difficulty } from '~/types/contestAdmin'
@Component
export default class CreateProblemCard extends Vue {
  rules = {
    point: [
      (text: string) =>
        /^\d{2,4}$/.test(text) || '2 - 4 桁の整数で入力してください'
    ],
    required: [(text: string) => /\S+/.test(text) || 'このフィールドは必須です']
  }

  difficulties: Difficulty[] = [
    'Green',
    'Ceylon',
    'Dimbula',
    'Darjeeling',
    'Uva',
    'Earlgray',
    'Keemun',
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
    difficulty: 'Green',
    problemStatement: '',
    constraints: '',
    input: '',
    output: ''
  }

  valid = false

  onSubmit() {
    // API
  }
}
</script>
