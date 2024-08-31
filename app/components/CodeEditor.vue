<script setup lang="ts">
import { VueCodemirror } from 'codemirror-editor-vue3'
import type { EditorConfiguration } from 'codemirror'
import { useTheme } from 'vuetify'
import type { Language } from '~/types/language'
import 'codemirror/theme/material.css'

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

const theme = useTheme()

watchEffect(() => {
  options.mode = props.language?.mime
  options.readOnly = props.readOnly
  options.cursorBlinkRate = props.readOnly ? -1 : 530
  options.theme = theme.current.value.dark ? 'material' : 'default'
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
      :height="autoHeight ? 'auto' : '24.1em'"
      @input="onInput"
    />
  </ClientOnly>
</template>

<style scoped lang="scss">
.codemirror :deep(.CodeMirror) {
  border: solid 1px darkgray;
  border-radius: 2px;
  * {
    font-size: 13px;
    font-family: 'JetBrains Mono', 'NotoSans JP', Menlo, Monaco, Consolas,
      'Courier New', monospace !important;
  }
}
</style>
