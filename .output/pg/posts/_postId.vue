<template>
  <v-card v-if="!post" loading>
    <v-card-text>読み込み中... </v-card-text>
  </v-card>
  <ViewPost v-else :post="post" :show-edit="isAdmin" />
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import MarkdownPreviewModal from '../../comp/modals/MarkdownPreviewModal.vue'
import { Post } from '~/types/post'
import ViewPost from '../../comp/post/ViewPost.vue'
import { userStore } from '~/utils/store-accessor'

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

  get isAdmin() {
    return userStore.isAdmin
  }
}
</script>

<style scoped lang="scss"></style>
