<script setup lang="ts">
import { definePageMeta } from '#imports'
import EditCard from '~/components/manage/problems/EditCard.vue'
import EditTestcasesCard from '~/components/manage/problems/EditTestcasesCard.vue'
import EditJudgeCard from '~/components/manage/problems/EditJudgeCard.vue'
import CheckProblemCard from '~/components/manage/problems/CheckProblemCard.vue'

definePageMeta({
  middleware: 'authenticated',
  validate: (route) => {
    if (Array.isArray(route.params.problemId)) return false
    return /^[1-9]\d*$/.test(route.params.problemId)
  }
})

const route = useRoute()
const problemId = computed(() => parseInt(route.params.problemId as string))

useHead(() => ({
  title: `[${problemId.value}] 問題の編集`
}))

const tabs = ['overview', 'testcases', 'judge', 'preview']
const tabNames = ['問題概要', 'テストケース', 'ジャッジ', '表示確認']
const components = [
  EditCard,
  EditTestcasesCard,
  EditJudgeCard,
  CheckProblemCard
]
const selected = ref('')
nextTick(() => (selected.value = tabs[0]))
</script>

<template>
  <v-container>
    <v-btn class="mb-3" to="/manage/problems" variant="text" color="purple">
      問題一覧に戻る
    </v-btn>
    <v-card>
      <v-tabs v-model="selected" align-tabs="center">
        <v-tab v-for="(tab, i) in tabs" :key="tab" :value="tab">
          {{ tabNames[i] }}
        </v-tab>
      </v-tabs>
      <v-window v-model="selected">
        <v-window-item v-for="(tab, i) in tabs" :key="i" :value="tab">
          <component :is="components[i]" :problem-id="problemId" />
        </v-window-item>
      </v-window>
    </v-card>
  </v-container>
</template>
<style scoped lang="scss"></style>
