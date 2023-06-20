<script setup lang="ts">
import Posts from '~/utils/apis/Posts'
import ViewPostCard from '~/components/posts/ViewPostCard.vue'

const { data: posts } = await useApi(Posts.getPosts, [])
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
      />
    </template>
  </v-container>
</template>

<style scoped lang="scss"></style>
