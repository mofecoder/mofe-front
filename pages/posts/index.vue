<script setup lang="ts">
import Posts from '~/utils/apis/Posts'
import ViewPostCard from '~/components/posts/ViewPostCard.vue'
import { useUserStore } from '~/store/user'
import { definePageMeta } from '#imports'
definePageMeta({
  layout: 'top'
})

const { data: posts } = await useApi(Posts.getPosts, [])
const userStore = useUserStore()
const { user } = toRefs(userStore)
const isAdmin = computed(() => user.value?.role === 'admin')

useHead({
  title: '記事一覧'
})
</script>

<template>
  <v-container>
    <h2>記事一覧</h2>
    <template v-if="posts">
      <ViewPostCard
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
