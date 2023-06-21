<script setup lang="ts">
import { VueCodemirror } from 'codemirror-editor-vue3'
import type { EditorConfiguration } from 'codemirror'
import { Language } from '~/types/language'

const props = defineProps<{
  modelValue: string
  readOnly?: boolean
  autoHeight?: boolean
  language?: Language
}>()
const emits = defineEmits<{
  'update:modelValue': [value: string]
}>()

const options: EditorConfiguration = reactive({
  tabSize: 2,
  lineNumbers: true,
  line: true,
  lineSeparator: '\n',
  viewportMargin: Infinity
} as EditorConfiguration)

watchEffect(() => {
  options.mode = props.language?.mime
  options.readOnly = props.readOnly
  options.cursorBlinkRate = props.readOnly ? -1 : 530
})

function onInput(value: string) {
  emits('update:modelValue', value)
}
</script>

<template>
  <ClientOnly>
    <VueCodemirror
      :value="modelValue"
      class="codemirror"
      :class="autoHeight && 'codemirror-auto-height'"
      :options="options"
      @input="onInput"
    />
  </ClientOnly>
</template>

<style scoped lang="scss">
.codemirror :deep(.CodeMirror) {
  border: solid 1px darkgray;
  border-radius: 2px;
  height: 24.1em !important;
}
.codemirror-auto-height :deep(.CodeMirror) {
  height: auto !important;
}
</style>