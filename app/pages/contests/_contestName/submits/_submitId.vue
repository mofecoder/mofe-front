<template>
  <v-card v-if="!errorMessage" :loading="!submit">
    <v-card-title v-if="submit">提出 #{{ submit.id }}</v-card-title>
    <v-card-text>
      <template>
        <Editor v-show="submit" ref="editor" :language="language" read-only />
      </template>
    </v-card-text>
  </v-card>
  <v-alert v-else type="error">
    {{ errorMessage }}
  </v-alert>
</template>

<script lang="ts">
import { Component, mixins, Ref } from 'nuxt-property-decorator'
import MixinContest from '~/mixins/contest'
import Editor from '~/components/Editor.vue'
import { SubmitDetail } from '~/types/submits'
import { HttpError } from '~/utils/axios'

@Component({
  components: { Editor },
  layout: 'contest'
})
export default class PageSubmitDetail extends mixins(MixinContest) {
  @Ref()
  editor!: any

  submit: SubmitDetail | null = null
  errorMessage: string | null = null

  async fetch() {
    await this.getContest()
    await this.$api.Contests.showSubmit(
      this.$route.params.contestName,
      Number(this.$route.params.submitId)
    )
      .then((res) => {
        this.submit = res
      })
      .catch((error: Error) => {
        if (error instanceof HttpError) {
          this.errorMessage = error.response.data.error
        }
      })
    this.editor.value = this.submit!.source
  }

  get language() {
    if (!this.submit) return null
    return this.$getLanguage(this.submit.lang)
  }
}
</script>

<style scoped lang="scss"></style>
