<script setup lang="ts">
import { postsApi } from '~/utils/apis'
import { useUserStore } from '~/store/user'
definePageMeta({
  layout: 'top'
})

const postsRepo = postsApi()
const { data: posts } = await useAsyncData('posts', () => postsRepo.list())
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const isAdmin = computed(() => user.value?.role === 'admin')

useHead({
  title: '記事一覧'
})
</script>

<template>
  <v-container>
    <h2>記事一覧</h2>
    <template v-if="posts">
      <PostsViewPostCard
        v-for="post in posts"
        :key="`post-${post.id}`"
        :post="post"
        class="mt-4"
        :show-edit="isAdmin"
      />
    </template>
  </v-container>
</template>

<style scoped lang="scss"></style>
