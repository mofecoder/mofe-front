<template>
  <v-data-table :headers="headers" :items="items" locale="ja">
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>問題一覧</v-toolbar-title>
        <v-spacer />
        <v-btn color="primary" class="mb-2" @click="newProblem"
          >問題を作成</v-btn
        >
      </v-toolbar>
    </template>
    <template v-slot:item.contestName="{ item }">
      <n-link v-if="item" :to="`/contests/${item.contestSlug}`">
        {{ item.contestName }}
      </n-link>
    </template>
    <template v-slot:item.edit="{ item }">
      <v-icon small @click="edit(item.id)">mdi-pencil</v-icon>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { Problem } from '~/types/problems'

@Component({
  middleware: 'authenticated'
})
export default class PageWriterProblem extends Vue {
  headers = [
    { text: '問題名', value: 'name' },
    { text: '難易度', value: 'difficulty' },
    { text: 'コンテスト名', value: 'contestName' },
    { text: '', value: 'edit', sortable: false }
  ]

  problems: Problem[] = []

  get items() {
    return this.problems.map((p) => ({
      id: p.id,
      name: p.name,
      contestName: p.contest?.name,
      difficulty: p.difficulty,
      contestSlug: p.contest?.slug
    }))
  }

  async created() {
    this.problems = await this.$api.Problems.index()
  }

  newProblem() {}
  edit(problemId: number) {
    this.$router.push(`/writer/problems/${problemId}`)
  }
}
</script>

<style scoped lang="scss"></style>
