<script setup lang="ts">
import { ref } from 'vue'
import type { Post } from '~~/types/post'
import { useUserStore } from '~/store/user'
import useApi from '~/composables/useApi'
import Posts from '~/utils/apis/Posts'
import ViewPostCard from '~/components/posts/ViewPostCard.vue'
import ContestList from '~/components/ContestList.vue'

const { data: postsData } = await useApi(Posts.getPosts, [], {
  lazy: true
})

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
  title: 'MOFE',
  titleTemplate: null
})

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
          <v-card variant="outlined">
            <v-card-text>
              <ContestList />
              <ClientOnly>
                <div class="mt-4">
                  <p>障害情報等のお知らせは X で発信しています</p>
                  <a
                    href="https://twitter.com/CafeCoder_?ref_src=twsrc%5Etfw"
                    class="twitter-follow-button"
                    data-lang="ja"
                    data-show-count="true"
                    >Follow @CafeCoder_</a
                  >
                </div>
              </ClientOnly>
              <div class="mt-4 manage-buttons">
                <v-btn v-if="isAdmin" color="orange-lighten-1" to="/admin"
                  >管理ページへ</v-btn
                >
                <v-btn v-if="isAdmin" color="primary" to="/manage/contests"
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

<style scoped lang="scss">
.manage-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
</style>
