<script setup lang="ts">
import { VDataTable } from 'vuetify/labs/components'
import ManageProblems from '~/utils/apis/ManageProblems'

definePageMeta({
  middleware: 'authenticated'
})
useHead({
  title: '問題の管理'
})

const headers = [
  { title: '問題名', key: 'name' },
  { title: '難易度', key: 'difficulty' },
  { title: 'コンテスト名', key: 'contestName' },
  { title: 'writer', key: 'writerUser' },
  { title: '', key: 'edit', sortable: false }
]

const { data: problems } = await useApi(ManageProblems.getProblems, [])

const items = computed(() =>
  problems.value
    ? problems.value.map((p) => ({
        id: p.id,
        name: p.name,
        contestName: p.contest?.name,
        writerUser: p.writerUser,
        difficulty: p.difficulty,
        contestSlug: p.contest?.slug
      }))
    : []
)
</script>

<template>
  <v-data-table :headers="headers" :items="items" locale="ja">
    <template #top>
      <v-toolbar flat color="white">
        <v-toolbar-title>問題一覧</v-toolbar-title>
        <v-spacer />
        <v-btn
          color="primary"
          class="mb-2"
          to="/manage/problems/new"
          variant="tonal"
          prepend-icon="mdi-plus-box"
          >問題を作成</v-btn
        >
      </v-toolbar>
    </template>
    <template #item.contestName="{ item: { columns: item, index } }">
      <NuxtLink v-if="item" :to="`/contests/${items[index].contestSlug}`">
        {{ item.contestName }}
      </NuxtLink>
    </template>
    <template #item.edit="{ item: { index } }">
      <v-btn
        icon
        variant="text"
        size="small"
        density="compact"
        :to="`/manage/problems/${items[index].id}`"
      >
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
    </template>
  </v-data-table>
</template>

<style scoped lang="scss"></style>
