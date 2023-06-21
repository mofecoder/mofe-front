<script lang="ts" setup>
import { PropType } from 'vue'
import { Post } from '~/types/post'
import { formatDate } from '~/utils/formatting'

defineProps({
  post: {
    type: Object as PropType<Post>,
    required: true
  },
  showEdit: {
    type: Boolean,
    default: false
  }
})
const app = useNuxtApp()
</script>

<template>
  <v-card rounded :title="post.title">
    <v-card-text class="post-card-text mt-2">
      <div v-html="app.$md.render(post.content)" />
      <div class="text-grey-darken-2 text-right py-1 pr-2">
        <p class="text-caption mb-0">
          投稿日時: {{ formatDate(post.createdAt) }}
        </p>
        <p class="text-caption mb-0">
          最終更新: {{ formatDate(post.updatedAt) }}
        </p>
      </div>
    </v-card-text>
    <template v-if="showEdit" #actions>
      <v-btn
        v-if="showEdit"
        class="mt-3"
        color="purple white--text"
        :to="`/admin/posts/${post.id}`"
      >
        この記事を編集する
      </v-btn>
    </template>
  </v-card>
</template>

<style scoped lang="scss">
.post-card-text {
  @import 'styles/card-reset';
  //@include card-text-reset();
}
</style>
