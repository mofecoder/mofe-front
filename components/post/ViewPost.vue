<template>
  <v-card rounded>
    <v-card-title class="bg-grey-lighten-3 py-1 heading-6">
      <NuxtLink v-if="enableLink" :to="`/posts/${post.id}`">{{
        post.title
      }}</NuxtLink>
      <template v-else>{{ post.title }}</template>
    </v-card-title>
    <v-card-text class="post-card-text mt-2">
      <v-btn
        v-if="showEdit"
        class="mb-3"
        color="purple white--text"
        :to="`/manage/posts/${post.id}`"
      >
        この記事を編集する
      </v-btn>
    </v-card-text>
    <div v-html="app.$md.render(post.content)" />
    <div class="bg-grey-darken-2 text-white text-right py-1 pr-2">
      <p class="text-caption mb-0">
        投稿日時: {{ formatDate(post.createdAt) }}
      </p>
      <p class="text-caption mb-0">
        最終更新: {{ formatDate(post.updatedAt) }}
      </p>
    </div>
  </v-card>
</template>

<script lang="ts" setup>
import { PropType } from 'vue'
import dayjs, { ConfigType } from 'dayjs'
import { Post } from '~/types/post'

const props = defineProps({
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
    default: true
  }
})

const formatDate = (date: ConfigType): string => {
  return dayjs(date).format('YYYY/MM/DD HH:mm')
}

const app = useNuxtApp()
</script>

<style scoped lang="scss">
.post-card-text {
  @import 'styles/card-reset';
  @include card-text-reset();
}
</style>
