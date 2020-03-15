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

  @Watch('language', { immediate: true })
  onChangeLanguage() {
    this.$set(this.cmOptions, 'mode', this.language?.mime || null)
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
