<template>
  <v-card :loading="!submit">
    <v-card-title v-if="submit">提出 #{{ submit.id }}</v-card-title>
    <v-card-text>
      <template v-show="submit">
        <Editor ref="editor" :language="language" read-only />
      </template>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, mixins, Ref } from 'nuxt-property-decorator'
import MixinContest from '~/mixins/contest'
import Editor from '~/components/Editor.vue'
import { SubmitDetail } from '~/types/submits'

@Component({
  components: { Editor },
  layout: 'contest'
})
export default class PageSubmitDetail extends mixins(MixinContest) {
  @Ref()
  editor!: any

  submit: SubmitDetail | null = null

  async created() {
    await this.getContest()
    this.submit = await this.$api.Contests.showSubmit(
      this.$route.params.contestName,
      Number(this.$route.params.submitId)
    )
    this.editor.value = this.submit.source
  }

  get language() {
    return {
      innerName: 'cpp17_gcc7',
      name: 'C++17 (g++ 7.4.0)',
      mime: 'text/x-c++src'
    }
  }
}
</script>

<style scoped lang="scss"></style>
