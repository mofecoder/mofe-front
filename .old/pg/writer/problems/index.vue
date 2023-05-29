<template>
  <v-data-table :headers="headers" :items="items" locale="ja">
    <template #top>
      <v-toolbar flat color="white">
        <v-toolbar-title>問題一覧</v-toolbar-title>
        <v-spacer />
        <v-btn color="primary" class="mb-2" nuxt to="new" append
          >問題を作成</v-btn
        >
      </v-toolbar>
    </template>
    <template #item.contestName="{ item }">
      <NuxtLink v-if="item" :to="`/contests/${item.contestSlug}`">
        {{ item.contestName }}
      </NuxtLink>
    </template>
    <template #item.edit="{ item }">
      <v-icon size="small" @click="edit(item.id)">mdi-pencil</v-icon>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { Problem } from '~/types/problems'

@Component({
  middleware: 'authenticated',
  head: { title: '問題の管理' }
})
export default class PageWriterProblem extends Vue {
  headers = [
    { text: '問題名', value: 'name' },
    { text: '難易度', value: 'difficulty' },
    { text: 'コンテスト名', value: 'contestName' },
    { text: 'writer', value: 'writerUser' },
    { text: '', value: 'edit', sortable: false }
  ]

  problems: Problem[] = []

  get items() {
    return this.problems.map((p) => ({
      id: p.id,
      name: p.name,
      contestName: p.contest?.name,
      writerUser: p.writerUser,
      difficulty: p.difficulty,
      contestSlug: p.contest?.slug
    }))
  }

  async created() {
    this.problems = await this.$api.Problems.index()
  }

  edit(problemId: number) {
    this.$router.push(`/writer/problems/${problemId}`)
  }
}
</script>

<style scoped lang="scss"></style>
