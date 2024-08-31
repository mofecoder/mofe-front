<script setup lang="ts">
import { useUserStore } from '~/store/user'
import ViewPostCard from '~/components/posts/ViewPostCard.vue'
import Posts from '~/utils/apis/Posts'

const user = storeToRefs(useUserStore()).user
const isAdmin = computed(() => user.value?.role === 'admin')

const route = useRoute()
const postId = computed(() =>
  Array.isArray(route.params.postId) ? null : parseInt(route.params.postId)
)
const { data: post } = await useApi(Posts.getPost, [postId.value!])

useHead(() => ({
  title: post.value ? post.value.title : 'Loading...'
}))
</script>

<template>
  <v-card v-if="!post" loading>読み込み中…</v-card>
  <ViewPostCard v-else :post="post" :show-edit="isAdmin" />
</template>

<style scoped lang="scss"></style>
