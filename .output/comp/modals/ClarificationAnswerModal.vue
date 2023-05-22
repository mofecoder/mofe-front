<template>
  <v-dialog :model-value="true" persistent>
    <v-card :loading="!clarification">
      <v-card-title>質問に回答</v-card-title>
      <template v-if="clarification">
        <v-card-text class="text--black">
          <v-textarea
            disabled
            auto-grow
            label="質問"
            :model-value="clarification.question"
          />
          <v-textarea v-model="clarification.answer" rows="3" label="回答" />
          <v-switch v-model="clarification.publish" label="全体公開する" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" color="red" @click="cancel">キャンセル</v-btn>
          <v-btn variant="text" color="primary" @click="answer">回答する</v-btn>
        </v-card-actions>
      </template>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { Clarification } from '~/types/clarification'

@Component
export default class ClarificationModal extends Vue {
  @Prop({ required: true })
  contestSlug!: string

  @Prop({ required: true })
  clarificationId!: number

  clarification: Clarification | null = null

  async fetch() {
    this.clarification = await this.$api.Contests.clarification(
      this.contestSlug,
      this.clarificationId
    )
  }

  cancel() {
    this.$emit('close', false)
  }

  answer() {
    this.$api.Contests.updateClarification(
      this.contestSlug,
      this.clarificationId,
      {
        answer: this.clarification!.answer!,
        publish: this.clarification!.publish
      }
    ).then(() => {
      this.$emit('close', true)
    })
  }
}
</script>

<style scoped lang="scss"></style>
