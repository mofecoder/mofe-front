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
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  components: {
    codemirror
  }
})
export default class Editor extends Vue {
  public value: string = ''
  cmOptions = {
    tabSize: 2,
    mode: 'text/x-c++src',
    lineNumbers: true,
    line: true,
    lineSeparator: '\n'
  }
}
</script>

<style lang="scss" scoped></style>
