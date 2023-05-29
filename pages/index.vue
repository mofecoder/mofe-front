<script setup lang="ts">
import { ref } from 'vue'
import dayjs from 'dayjs'
import { Contest } from '~~/types/contest'
import { Post } from '~~/types/post'
import ViewPost from '~/components/post/ViewPost.vue'
import { useUserStore } from '~/store/user'
import useApi from '~/composables/useApi'
import Contests from '~/utils/apis/Contests'
import Posts from '~/utils/apis/Posts'

const { data: contestsData } = await useApi(Contests.getContests, [])
const { data: postsData } = await useApi(Posts.getPosts, [])

const contests = ref<Contest[] | null>(contestsData.value ?? null)
const posts = ref<Post[] | null>(postsData.value ?? null)

const userStore = useUserStore()

useHead({
  script: [
    {
      src: 'https://platform.twitter.com/widgets.js',
      async: true
    }
  ]
})

const formatDate = (date: string) => dayjs(date).format('MM/DD HH:mm')

const checkStatus = (contest: Contest) => {
  const startAt = dayjs(contest.startAt)
  const endAt = dayjs(contest.endAt)

  if (startAt.isAfter(Date())) return '予　定'
  if (endAt.isBefore(Date())) return '終　了'
  return '開催中'
}

const registerAtCoder = computed(() => {
  const user = userStore.getUser
  return user && user.role !== 'admin' && user.atcoderId == null
})

const loggedIn = computed(() => {
  return userStore.getUser && userStore.getUser.role === 'admin'
})

const isWriter = computed(() => {
  return (
    userStore.getUser && ['admin', 'writer'].includes(userStore.getUser.role)
  )
})
</script>

<template>
  <div>
    <v-container>
      <v-row>
        <v-col cols="12" lg="5">
          <v-card variant="outlined" :loading="!contests">
            <v-card-text>
              <v-table>
                <thead>
                  <tr>
                    <th style="width: 7em" />
                    <th style="width: 9.5em">開始日時</th>
                    <th>コンテスト名</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="contest in contests || []" :key="contest.slug">
                    <td v-text="checkStatus(contest)" />
                    <td v-text="formatDate(contest.startAt)" />
                    <td>
                      <NuxtLink :to="`contests/${contest.slug}`">
                        {{ contest.name }}
                      </NuxtLink>
                    </td>
                  </tr>
                </tbody>
              </v-table>
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
              <div class="mt-4">
                <v-btn v-if="loggedIn" color="orange" to="/manage"
                  >管理ページへ</v-btn
                >
                <v-btn v-if="isWriter" color="primary" to="/writer/problems"
                  >問題の管理画面へ</v-btn
                >
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" lg="7">
          <v-alert v-if="registerAtCoder" density="compact" type="info">
            ユーザページから AtCoder ID が登録可能です。ぜひご登録ください。
          </v-alert>
          <ViewPost
            v-for="post in posts || []"
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
  </div>
</template>
