<template>
  <v-dialog :value="value" persistent>
    <v-card>
      <v-card-title>質問する</v-card-title>
      <v-card-text class="black--text">
        <v-select
          label="問題"
          :items="items"
          hint="コンテスト全体に対する質問の場合は空欄にしてください"
          persistent-hint
          clearable
          no-data-text="問題は存在しません"
        >
        </v-select>
        <v-textarea v-model="content" rows="3" label="質問" />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text color="red" @click="cancel">キャンセル</v-btn>
        <v-btn text color="primary" :disabled="!content" @click="question"
          >質問する</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { Task } from '~/types/task'

@Component
export default class ClarificationQuestionModal extends Vue {
  @Prop({ required: true })
  value!: boolean

  @Prop({ required: true })
  tasks!: Task[] | null

  problem: string | null = null
  content = ''

  cancel() {
    this.$emit('close', false)
    this.problem = null
    this.content = ''
  }

  question() {
    this.$emit('submit', this.problem, this.content)
    this.problem = null
    this.content = ''
  }

  get items() {
    return this.tasks?.map((task) => ({
      text: `${task.position} - ${task.name}`,
      value: task.slug
    }))
  }
}
</script>

<style scoped lang="scss"></style>
