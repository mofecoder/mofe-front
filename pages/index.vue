<script setup lang="ts">
import { useDisplay } from 'vuetify'
import { useUserStore } from '~/store/user'
import useApi from '~/composables/useApi'
import Posts from '~/utils/apis/Posts'

const { data: posts } = await useApi(Posts.getPosts, [], {
  lazy: true
})

const userStore = useUserStore()
const { user } = toRefs(userStore)

const route = useRoute()

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

definePageMeta({
  layout: 'top'
})

const registerAtCoder = computed(() => {
  return user.value && user.value.atcoderId == null
})

const isAdmin = computed(() => user.value?.role === 'admin')

const isWriter = computed(() =>
  ['admin', 'writer'].includes(user.value?.role || '')
)

const { lgAndUp } = useDisplay()
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
      <v-alert
        v-if="'signed-out' in route.query"
        class="mb-6"
        variant="outlined"
        type="success"
        title="ログアウトしました。"
      />
      <v-row>
        <v-col cols="12" lg="6">
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
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" lg="6">
          <template v-if="posts">
            <v-virtual-scroll v-if="lgAndUp" :items="posts" :max-height="1000">
              <template #default="{ item }">
                <div class="mx-1">
                  <PostsViewPostCard
                    :show-edit="isAdmin"
                    :post="item"
                    enable-link
                    class="mb-3"
                  />
                </div>
              </template>
            </v-virtual-scroll>
            <div v-else>
              <div v-for="item in posts" :key="`post-${item.id}`" class="mx-1">
                <PostsViewPostCard
                  :show-edit="isAdmin"
                  :post="item"
                  enable-link
                  class="mb-3"
                />
              </div>
            </div>
          </template>
          <div class="text-center">
            <router-link to="/posts">すべての記事を見る</router-link>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped lang="scss"></style>
