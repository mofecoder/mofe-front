<script setup lang="ts">
import { useDisplay } from 'vuetify'
import { useUserStore } from '~/store/user'
import useApi from '~/composables/useApi'
import { top } from '~/utils/apis'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const route = useRoute()

const { data, error } = await useApi(top, [], { lazy: true })

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

const { lgAndUp } = useDisplay()
</script>

<template>
  <div>
    <v-alert
      v-if="registerAtCoder && !isAdmin"
      density="compact"
      type="info"
      variant="tonal"
      class="mb-6"
      closable
    >
      <NuxtLink to="/user" class="text-decoration-none">ユーザページ</NuxtLink>
      から AtCoder ID が登録可能です。ぜひご登録ください。
    </v-alert>
    <v-alert
      v-if="'signed-out' in route.query"
      class="mb-6"
      variant="outlined"
      type="success"
      title="ログアウトしました。"
    />
    <v-alert
      v-if="error"
      type="error"
      title="データの読み込みに失敗しました。"
      :text="error.message"
    />
    <template v-if="!data" />
    <v-container v-else>
      <v-row>
        <v-col cols="12" lg="6">
          <v-card variant="outlined">
            <v-card-text>
              <v-list v-if="data.creating" nav density="comfortable">
                <v-list-subheader>作成中の問題</v-list-subheader>
                <v-list-item
                  v-for="problem in data.creating"
                  :key="problem.id"
                  :to="`/manage/problems/${problem.id}`"
                  :title="problem.name"
                  :subtitle="
                    problem.contest?.name || '（コンテスト未割り当て）'
                  "
                />
              </v-list>
              <ContestList :contests="data?.contests || null" />
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
          <template v-if="data.posts">
            <v-virtual-scroll
              v-if="lgAndUp"
              :items="data.posts"
              :max-height="1000"
            >
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
              <div
                v-for="item in data.posts"
                :key="`post-${item.id}`"
                class="mx-1"
              >
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
