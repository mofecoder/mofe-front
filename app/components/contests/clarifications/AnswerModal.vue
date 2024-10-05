<script setup lang="ts">
import Contests from '~/utils/apis/Contests'

const props = defineProps<{
  contestSlug: string
  clarificationId: number
}>()

const { data } = await useApi(Contests.getClarification, [
  props.contestSlug,
  props.clarificationId
])
const clarification = ref(data.value)

watch(data, (newData) => {
  clarification.value = newData
})

const emit = defineEmits<{
  close: [update: boolean]
}>()

function cancel() {
  emit('close', false)
}

async function answer() {
  await api(
    Contests.updateClarification,
    [props.contestSlug, props.clarificationId],
    {},
    {
      answer: clarification.value!.answer,
      publish: clarification.value!.publish
    }
  ).then(() => {
    emit('close', true)
  })
}
</script>

<template>
  <v-dialog :model-value="true" persistent>
    <v-card :loading="!clarification">
      <v-card-title>質問に回答</v-card-title>
      <template v-if="clarification">
        <v-card-text class="text--black">
          <v-textarea
            readonly
            auto-grow
            label="質問"
            :model-value="clarification.question"
          />
          <v-textarea
            v-model="clarification.answer"
            rows="3"
            label="回答"
            hint="回答を空欄にして全体公開すると、「質問」の内容がアナウンス扱いになります。"
            counter="255"
            persistent-hint
          />
          <v-switch
            v-model="clarification.publish"
            color="orange"
            label="全体公開する"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn variant="flat" color="red" @click="cancel">キャンセル</v-btn>
          <v-btn variant="flat" color="primary" @click="answer">回答する</v-btn>
        </v-card-actions>
      </template>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss"></style>
