<script setup lang="ts">
import { ref } from 'vue'
import dayjs from 'dayjs'
import { Contest } from '~~/types/contest'
import { Post } from '~~/types/post'
import { useUserStore } from '~/store/user'
import useApi from '~/composables/useApi'
import Contests from '~/utils/apis/Contests'
import Posts from '~/utils/apis/Posts'
import ViewPostCard from '~/components/posts/ViewPostCard.vue'
import { formatDate } from '~/utils/formatting'

const { data: contestsData } = await useApi(Contests.getContests, [])
const { data: postsData } = await useApi(Posts.getPosts, [])

const contests = ref<Contest[] | null>(contestsData.value ?? null)
const posts = ref<Post[] | null>(postsData.value ?? null)

const userStore = useUserStore()
const { user } = toRefs(userStore)

useHead({
  script: [
    {
      src: 'https://platform.twitter.com/widgets.js',
      async: true
    }
  ],
  title: 'CafeCoder',
  titleTemplate: null
})

const checkStatus = (contest: Contest) => {
  const startAt = dayjs(contest.startAt)
  const endAt = dayjs(contest.endAt)

  if (startAt.isAfter(Date())) return '予　定'
  if (endAt.isBefore(Date())) return '終　了'
  return '開催中'
}

const registerAtCoder = computed(() => {
  return user.value && user.value.atcoderId == null
})

const isAdmin = computed(() => user.value?.role === 'admin')

const isWriter = computed(() =>
  ['admin', 'writer'].includes(user.value?.role || '')
)
</script>

<template>
  <div>
    <v-container>
      <v-alert
        v-if="registerAtCoder && !isAdmin"
        density="compact"
        type="info"
        variant="tonal"
        class="mb-6"
        closable
      >
        <NuxtLink to="/user" class="text-decoration-none"
          >ユーザページ</NuxtLink
        >
        から AtCoder ID が登録可能です。ぜひご登録ください。
      </v-alert>
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
                    <td v-text="formatDate(contest.startAt, false)" />
                    <td>
                      <NuxtLink :to="`contests/${contest.slug}`">
                        {{ contest.name }}
                      </NuxtLink>
                    </td>
                  </tr>
                </tbody>
              </v-table>
              <ClientOnly>
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
              </ClientOnly>
              <div class="mt-4">
                <v-btn
                  v-if="isAdmin"
                  color="orange-lighten-1"
                  class="mb-2 mr-4"
                  to="/admin"
                  >管理ページへ</v-btn
                >
                <v-btn
                  v-if="isAdmin"
                  color="primary"
                  class="mr-4 mb-2"
                  to="/manage/contests"
                  >コンテストの管理画面へ</v-btn
                >
                <v-btn v-if="isWriter" color="primary" to="/manage/problems"
                  >問題の管理画面へ</v-btn
                >
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" lg="7">
          <ViewPostCard
            v-for="post in posts || []"
            :key="`post-${post.id}`"
            :show-edit="isAdmin"
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
