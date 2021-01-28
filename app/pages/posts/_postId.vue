<template>
  <v-card v-if="!post" loading>
    <v-card-text>読み込み中... </v-card-text>
  </v-card>
  <ViewPost v-else :post="post" />
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import MarkdownPreviewModal from '~/components/modals/MarkdownPreviewModal.vue'
import { Post } from '~/types/post'
import ViewPost from '~/components/post/ViewPost.vue'

@Component({
  components: { ViewPost, MarkdownPreviewModal },
  validate({ route }) {
    return /^\d+$/.test(route.params.postId)
  }
})
export default class PageViewPost extends Vue {
  post: Post | null = null

  async fetch() {
    this.post = await this.$api.Posts.show(this.postId)
  }

  get postId() {
    return parseInt(this.$route.params.postId)
  }
}
</script>

<style scoped lang="scss"></style>
