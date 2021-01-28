<template>
  <v-card :loading="!(contests && problems)">
    <v-container>
      <v-row>
        <v-col>
          <v-btn link to="/manage/contests" color="primary" block
            >コンテスト管理画面へ</v-btn
          >
          <v-btn class="mt-2" link to="/manage/posts" color="primary" block
            >記事管理画面へ</v-btn
          >
          <v-btn color="yellow" class="mt-2" @click="updateRating"
            >レーティング更新</v-btn
          >
        </v-col>
        <v-col>
          <h2>問題（未所属）</h2>
          <ul v-if="problems && problems.length">
            <li v-for="problem in problems" :key="problem.id">
              <n-link :to="`/writer/problems/${problem.id}`">
                {{ problem.name }} ({{ problem.difficulty }}) by
                {{ problem.writerUser }}
              </n-link>
            </li>
          </ul>
          <p v-else-if="problems != null">該当なし</p>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { Contest } from '~/types/contest'
import { Problem } from '~/types/contestAdmin'
import { httpPost } from '~/utils/axios'

@Component({
  middleware: 'admin',
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

  updateRating() {
    httpPost('/users/update_rating')
  }
}
</script>
