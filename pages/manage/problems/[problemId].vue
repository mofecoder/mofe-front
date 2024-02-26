<script setup lang="ts">
import { definePageMeta } from '#imports'
import EditCard from '~/components/manage/problems/EditCard.vue'
import EditTestcasesCard from '~/components/manage/problems/EditTestcasesCard.vue'
import EditJudgeCard from '~/components/manage/problems/EditJudgeCard.vue'
import CheckProblemCard from '~/components/manage/problems/CheckProblemCard.vue'
import ManageProblems from '~/utils/apis/ManageProblems'

definePageMeta({
  middleware: 'authenticated',
  validate: (route) => {
    if (Array.isArray(route.params.problemId)) return false
    return /^[1-9]\d*$/.test(route.params.problemId)
  },
  layout: 'default'
})

const route = useRoute()
const problemId = computed(() => parseInt(route.params.problemId as string))
const { data: problem, refresh } = await useApi(ManageProblems.getProblem, [
  problemId.value
])

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
const selected = ref(tabs[0])
</script>

<template>
  <v-container>
    <v-btn
      class="mb-3"
      to="/manage/problems"
      variant="tonal"
      color="purple"
      prepend-icon="mdi-arrow-left"
    >
      問題一覧に戻る
    </v-btn>
    <h3 v-if="problem">編集中: [{{ problemId }}] {{ problem.name }}</h3>
    <v-card class="mt-2">
      <v-tabs v-model="selected" align-tabs="center">
        <v-tab v-for="(tab, i) in tabs" :key="tab" :value="tab">
          {{ tabNames[i] }}
        </v-tab>
      </v-tabs>
      <v-window v-model="selected" :continuous="false">
        <v-window-item v-for="(tab, i) in tabs" :key="i" :value="tab" eager>
          <component
            :is="components[i]"
            :problem-id="problemId"
            @update="refresh"
          />
        </v-window-item>
      </v-window>
    </v-card>
  </v-container>
</template>
<style scoped lang="scss"></style>
