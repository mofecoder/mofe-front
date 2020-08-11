<template>
  <div class="codemirror">
    <codemirror v-model="value" :options="cmOptions" />
  </div>
</template>

<script lang="ts">
// @ts-ignore
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/clike/clike.js'
import 'codemirror/mode/python/python.js'
import 'codemirror/mode/go/go.js'
import { Component, Prop, Vue, Watch } from 'nuxt-property-decorator'
import { Language } from '~/types/language'

@Component({
  components: {
    codemirror
  }
})
export default class Editor extends Vue {
  public value: string = ''

  @Prop({ required: true })
  language!: Language | undefined

  @Prop({ default: false })
  readOnly!: string | boolean | null

  @Watch('language', { immediate: true })
  onChangeLanguage() {
    this.$set(this.cmOptions, 'mode', this.language?.mime || null)
  }

  @Watch('readOnly', { immediate: true })
  onChangeReadOnly() {
    const isReadonly = this.readOnly === true || this.readOnly === ''
    this.$set(this.cmOptions, 'readOnly', isReadonly)
    this.$set(this.cmOptions, 'cursorBlinkRate', isReadonly ? -1 : 530)
  }

  cmOptions = {
    tabSize: 2,
    mode: null,
    lineNumbers: true,
    line: true,
    lineSeparator: '\n'
  }
}
</script>

<style lang="scss" scoped></style>
