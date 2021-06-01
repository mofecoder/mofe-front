<template>
  <v-card rounded>
    <v-card-title class="grey lighten-3 py-1 heading-6">
      <nuxt-link v-if="enableLink" :to="`/posts/${post.id}`">{{
        post.title
      }}</nuxt-link>
      <template v-else>{{ post.title }}</template>
    </v-card-title>
    <v-card-text class="post-card-text mt-2">
      <v-btn
        v-if="showEdit"
        class="mb-3"
        color="purple white--text"
        nuxt
        :to="`/manage/posts/${post.id}`"
        >この記事を編集する</v-btn
      >
      <div v-html="$md.render(post.content)" />
    </v-card-text>
    <div class="grey darken-2 white--text text-right py-1 pr-2">
      <p class="caption mb-0">投稿日時: {{ formatDate(post.createdAt) }}</p>
      <p class="caption mb-0">最終更新: {{ formatDate(post.updatedAt) }}</p>
    </div>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import dayjs from 'dayjs'
import { Post } from '~/types/post'

@Component
export default class ViewPost extends Vue {
  @Prop({ required: true }) post!: Post
  @Prop() showEdit?: boolean
  @Prop({ type: Boolean }) enableLink!: boolean

  formatDate(date: Date): string {
    return dayjs(date).format('YYYY/MM/DD HH:mm')
  }
}
</script>

<style scoped lang="scss">
.post-card-text {
  @include card-text-reset();
}
</style>
