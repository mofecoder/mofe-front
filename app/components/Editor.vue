<template>
  <codemirror
    v-model="value"
    :class="isAutoHeight && 'codemirror-auto-height'"
    :options="cmOptions"
  />
</template>

<script lang="ts">
// @ts-ignore
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/clike/clike.js'
import 'codemirror/mode/python/python.js'
import 'codemirror/mode/go/go.js'
import 'codemirror/mode/rust/rust.js'
import 'codemirror/mode/ruby/ruby.js'
import 'codemirror/mode/fortran/fortran.js'
import 'codemirror/mode/crystal/crystal.js'
import 'codemirror/mode/perl/perl.js'
import 'codemirror/mode/shell/shell.js'

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

  @Prop({ default: false })
  autoHeight!: boolean | string

  get isAutoHeight() {
    return this.autoHeight !== false
  }

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
    lineSeparator: '\n',
    viewportMargin: Infinity
  }
}
</script>

<style lang="scss" scoped>
.vue-codemirror ::v-deep .CodeMirror {
  border: solid 1px darkgray;
  border-radius: 2px;
  height: 24.1em;
}
.codemirror-auto-height ::v-deep .CodeMirror {
  height: auto;
}
</style>
