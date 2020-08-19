<template>
  <v-container>
    <v-btn class="mb-3" nuxt to=".." append text color="purple"
      >問題一覧に戻る</v-btn
    >
    <EditProblemCard :problem-id="problemId" />
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import EditProblemCard from '~/components/EditProblemCard.vue'
@Component({
  components: { EditProblemCard },
  middleware: 'authenticated'
})
export default class PageWriterTaskEdit extends Vue {
  head() {
    return {
      title: `[${this.problemId}] 問題の編集`
    }
  }

  validate({ params }: { params: { [key: string]: string } }): boolean {
    return /^[1-9]\d*$/.test(params.problemId)
  }

  get problemId() {
    return Number(this.$route.params.problemId)
  }
}
</script>

<style scoped lang="scss"></style>
