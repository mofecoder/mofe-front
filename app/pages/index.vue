<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12" lg="5">
          <v-card outlined>
            <v-card-text>
              <v-simple-table v-if="contests">
                <thead>
                  <tr>
                    <th style="width: 7em" />
                    <th style="width: 9.5em">開始日時</th>
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
              <div class="mt-4">
                <p>障害情報等のお知らせは Twitter で発信しています</p>
                <a
                  href="https://twitter.com/CafeCoder_?ref_src=twsrc%5Etfw"
                  class="twitter-follow-button"
                  data-lang="ja"
                  data-show-count="true"
                  >Follow @CafeCoder_</a
                >
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" lg="7">
          <v-alert v-if="registerAtCoder" dense type="info">
            ユーザページから AtCoder ID が登録可能です。ぜひご登録ください。
          </v-alert>
          <ViewPost
            v-for="post in posts"
            :key="`post-${post.id}`"
            :post="post"
            enable-link
            class="mb-3"
          />
          <div class="text-center">
            <router-link to="/posts">すべての記事を見る</router-link>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <div class="mt-4">
      <v-btn v-if="loggedIn" color="orange" nuxt to="/manage"
        >管理ページへ</v-btn
      >
      <v-btn v-if="isWriter" color="primary" nuxt to="/writer/problems"
        >問題の管理画面へ</v-btn
      >
    </div>
    <!-- CafeCoder Twitter -->
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
import noticeData from '~/assets/notice.json'
import { Post } from '~/types/post'
import ViewPost from '~/components/post/ViewPost.vue'

@Component({
  components: { ViewPost },
  head: { title: 'トップ' }
})
export default class PageMainPage extends Vue {
  contests: Contest[] | null = null
  posts: Post[] | null = null
  notices = noticeData

  async fetch() {
    ;[this.contests, this.posts] = await Promise.all([
      await this.$api.Contests.index(),
      await this.$api.Posts.index(3)
    ])
  }

  get registerAtCoder() {
    const user = userStore.getUser
    return user && user.role !== 'admin' && user.atcoderId == null
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
