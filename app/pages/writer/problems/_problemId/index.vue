<template>
  <v-container>
    <v-btn class="mb-3" nuxt to=".." append text color="purple"
      >問題一覧に戻る</v-btn
    >
    <v-card>
      <v-tabs v-model="selected" grow>
        <v-tab>問題概要</v-tab>
        <v-tab>テストケース</v-tab>
        <v-tab>ジャッジ</v-tab>
        <v-tab>表示確認</v-tab>
      </v-tabs>
      <v-tabs-items v-model="selected">
        <v-tab-item v-for="(component, i) in components" :key="`comp-${i}`">
          <component :is="component" :problem-id="problemId" />
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import EditProblemCard from '~/components/writer/EditProblemCard.vue'
import Testcases from '~/components/writer/Testcases.vue'
import JudgeSettings from '~/components/writer/JudgeSettings.vue'
import ViewProblem from '~/components/writer/ViewProblem.vue'
@Component({
  components: { JudgeSettings, Testcases, EditProblemCard },
  middleware: 'authenticated'
})
export default class PageWriterTaskEdit extends Vue {
  head() {
    return {
      title: `[${this.problemId}] 問題の編集`
    }
  }

  validate({ params }: { params: { [_: string]: string } }): boolean {
    return /^[1-9]\d*$/.test(params.problemId)
  }

  selected = 0
  components = [EditProblemCard, Testcases, JudgeSettings, ViewProblem]

  get problemId() {
    return Number(this.$route.params.problemId)
  }
}
</script>

<style scoped lang="scss"></style>
