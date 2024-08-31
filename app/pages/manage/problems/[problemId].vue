<script setup lang="ts">
import EditCard from '~/components/manage/problems/EditCard.vue'
import EditTestcasesCard from '~/components/manage/problems/EditTestcasesCard.vue'
import EditJudgeCard from '~/components/manage/problems/EditJudgeCard.vue'
import CheckProblemCard from '~/components/manage/problems/CheckProblemCard.vue'
import ManageProblems from '~/utils/apis/ManageProblems'

definePageMeta({
  middleware: 'authenticated',
  validate: (route) => {
    if (typeof route.params.problemId !== 'string') return false
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
    <div class="mb-3 d-flex justify-space-between">
      <v-btn
        to="/manage/problems"
        variant="tonal"
        color="purple"
        prepend-icon="mdi-arrow-left"
      >
        問題一覧に戻る
      </v-btn>
      <v-btn
        v-if="problem?.contest"
        variant="tonal"
        color="orange"
        :to="`/contests/${problem.contest.slug}/tasks/${problem.slug}`"
        target="_blank"
        prepend-icon="mdi-open-in-new"
      >
        コンテストページで表示
      </v-btn>
    </div>
    <h3 v-if="problem">編集中: [{{ problemId }}] {{ problem.name }}</h3>
    <v-card class="mt-2">
      <v-tabs v-model="selected" align-tabs="center" color="secondary">
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
