<script setup lang="ts">
const props = defineProps<{
  markdown: string
  value: boolean
  title?: string
}>()
const emits = defineEmits<{
  close: []
}>()

const show = ref(false)
watch(
  () => props.value,
  (value) => {
    show.value = value
  }
)
function close() {
  emits('close')
}
</script>

<template>
  <v-dialog :model-value="show" @click:outside="close">
    <v-card>
      <v-card-title>
        {{ title || '' }}
      </v-card-title>
      <v-card-text class="modal-content">
        <MarkdownContent :markdown="markdown" />
      </v-card-text>
      <v-card-actions>
        <v-btn
          variant="flat"
          class="text-white"
          prepend-icon="mdi-close"
          color="red"
          block
          @click="close"
        >
          閉じる
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss">
@import '../styles/markdown';
.modal-content {
  @include markdown();
}
</style>
