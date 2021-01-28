<template>
  <v-container>
    <h2>記事一覧</h2>
    <template v-if="posts">
      <ViewPost
        v-for="post in posts"
        :key="`post-${post.id}`"
        :post="post"
        enable-link
        class="mt-4"
      />
    </template>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { Post } from '~/types/post'
import ViewPost from '~/components/post/ViewPost.vue'
@Component({
  components: { ViewPost }
})
export default class PagePosts extends Vue {
  posts: Post[] | null = null

  async fetch() {
    this.posts = await this.$api.Posts.index()
  }
}
</script>

<style scoped lang="scss"></style>
