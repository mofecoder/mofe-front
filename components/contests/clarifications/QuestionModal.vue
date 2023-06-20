<script setup lang="ts">
import { Task } from '~/types/task'

const props = defineProps<{
  value: boolean
  tasks: Task[] | null
}>()

const emit = defineEmits<{
  close: [update: boolean]
  submit: [problem: string | null, content: string]
}>()

const problem = ref<string | null>(null)
const content = ref('')

function cancel() {
  emit('close', false)
  problem.value = null
  content.value = ''
}

function question() {
  emit('submit', problem.value, content.value)
  problem.value = null
  content.value = ''
}

const items = computed(() => {
  return props.tasks?.map((task) => ({
    title: `${task.position} - ${task.name}`,
    value: task.slug
  }))
})
</script>

<template>
  <v-dialog :model-value="value" persistent>
    <v-card>
      <v-card-title>質問する</v-card-title>
      <v-card-text class="text-black">
        <v-select
          v-model="problem"
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
        <v-btn variant="text" color="red" @click="cancel">キャンセル</v-btn>
        <v-btn
          variant="text"
          color="primary"
          :disabled="!content"
          @click="question"
          >質問する</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss"></style>
