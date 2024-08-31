<script lang="ts" setup>
import type { PropType } from 'vue'
import type { Post } from '~/types/post'
import { formatDate } from '~/utils/formatting'

defineProps({
  post: {
    type: Object as PropType<Post>,
    required: true
  },
  showEdit: {
    type: Boolean,
    default: false
  },
  enableLink: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <v-card rounded variant="elevated" :title="post.title">
    <v-card-text class="post-card-text mt-2">
      <MarkdownContent :markdown="post.content" />
      <div class="text-grey-darken-2 text-right py-1 pr-2">
        <p class="text-caption mb-0">
          投稿日時: {{ formatDate(post.createdAt) }}
        </p>
        <p class="text-caption mb-0">
          最終更新: {{ formatDate(post.updatedAt) }}
        </p>
      </div>
    </v-card-text>
    <template v-if="showEdit || enableLink" #actions>
      <v-btn
        v-if="showEdit"
        prepend-icon="mdi-note-edit-outline"
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
@import '../../styles/markdown';
.post-card-text {
  @include markdown();
}
</style>
