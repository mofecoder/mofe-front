<template>
  <div>
    <v-card>
      <v-card-title>コンテストの一覧</v-card-title>
      <v-card-text>
        <v-simple-table v-if="contests">
          <thead>
            <tr>
              <th />
              <th>開始日時</th>
              <th>コンテスト名</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="contest in contests" :key="contest.slug">
              <td v-text="checkStatus(contest)" />
              <td v-text="formatDate(contest.startAt)" />
              <td>
                <nuxt-link
                  :to="`contests/${contest.slug}`"
                  v-text="contest.name"
                />
              </td>
            </tr>
          </tbody>
        </v-simple-table>
        <nuxt-link v-if="loggedIn" to="manage">管理ページへ</nuxt-link>
      </v-card-text>
    </v-card>
    <v-btn
      v-if="isWriter"
      class="mt-4"
      color="primary"
      nuxt
      to="/writer/problems"
      >問題の管理画面へ</v-btn
    >
    <!-- CafeCoder Twitter -->
    <div class="mt-4">
      <p>解説や障害情報等のお知らせは Twitter で発信しています</p>
      <a
        href="https://twitter.com/CafeCoder_?ref_src=twsrc%5Etfw"
        class="twitter-follow-button"
        data-lang="ja"
        data-show-count="true"
        >Follow @CafeCoder_</a
      >
    </div>
    <script
      async
      src="https://platform.twitter.com/widgets.js"
      charset="utf-8"
    ></script>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import dayjs from 'dayjs'
import { Contest } from '~/types/contest'
import { userStore } from '~/utils/store-accessor'

@Component({
  head: { title: 'トップ' }
})
export default class PageMainPage extends Vue {
  contests: Contest[] | null = null
  async created() {
    this.contests = await this.$api.Contests.index()
  }

  get loggedIn() {
    return userStore.getUser && userStore.getUser.role === 'admin'
  }

  get isWriter() {
    return (
      userStore.getUser && ['admin', 'writer'].includes(userStore.getUser.role)
    )
  }

  formatDate = (date: string) => dayjs(date).format('MM/DD HH:mm')

  checkStatus(contest: Contest) {
    const startAt = dayjs(contest.startAt)
    const endAt = dayjs(contest.endAt)

    if (startAt.isAfter(Date())) return '予　定'
    if (endAt.isBefore(Date())) return '終　了'
    return '開催中'
  }
}
</script>

<style scoped lang="scss"></style>
