<template>
  <v-card :loading="!(contests && problems)">
    <v-container>
      <v-row>
        <v-col>
          <h2>コンテスト（閲覧）</h2>
          <ul v-if="contests != null">
            <li v-for="contest in contests" :key="contest.slug">
              <n-link :to="`/contests/${contest.slug}`" v-text="contest.name" />
            </li>
          </ul>
        </v-col>
        <v-col>
          <h2>コンテスト（管理）</h2>
          <n-link to="/manage/contests">一覧</n-link>
          <n-link to="/manage/contests/new">作成</n-link>
        </v-col>
        <v-col>
          <h2>問題（未所属）</h2>
          <ul v-if="problems && problems.length">
            <li v-for="problem in problems" :key="problem.id">
              <n-link :to="`/writer/problems/${problem.id}`">
                {{ problem.name }} ({{ problem.name }}) by
                {{ problem.writerUser }}
              </n-link>
            </li>
          </ul>
          <p v-else-if="problems != null">
            該当なし
          </p>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { Contest } from '~/types/contest'
import { Problem } from '~/types/contestAdmin'

@Component({
  middleware: 'authenticated',
  head: { title: '管理画面' }
})
export default class PageManageIndex extends Vue {
  test: any = ''
  contests: Contest[] | null = null
  problems: Problem[] | null = null

  async created() {
    ;[this.contests, this.problems] = await Promise.all([
      this.$api.Contests.index(),
      this.$api.Problems.unsetProblems()
    ])
  }
}
</script>
