<template>
  <v-dialog :value="show" @click:outside="close">
    <v-card>
      <v-card-title>
        {{ title || '' }}
      </v-card-title>
      <v-card-text class="modal-content">
        <div class="md" v-html="$md.render(markdown)" />
      </v-card-text>
      <v-card-actions>
        <v-btn depressed class="white--text" color="red" block @click="close"
          >閉じる</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Emit, Prop, mixins, Watch } from 'nuxt-property-decorator'
import MathJax from '~/mixins/mathjax'

@Component
export default class MarkdownPreviewModal extends mixins(MathJax) {
  @Prop({ type: String, required: true })
  markdown!: string

  @Prop({ default: false, type: Boolean })
  value!: boolean

  @Prop({ type: String })
  title?: string

  show: boolean = false

  @Watch('value')
  change(): void {
    if (this.value) this.renderMathJax()
    this.$nextTick(() => {
      if (this.value) this.renderMathJax()
      this.show = this.value
    })
  }

  @Emit()
  close(): void {}
}
</script>

<style scoped lang="scss">
.modal-content {
  color: inherit !important;
  font-size: 1rem;
}
</style>
<style lang="scss">
@import '~/styles/markdown.scss';
.md {
  @include markdown();
}
</style>
