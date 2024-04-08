<script setup lang="ts">
import { definePageMeta } from '#imports'
import Posts from '~/utils/apis/Posts'
import type { Post } from '~/types/post'
import { STATUS_TABLE } from '~/constants/posts'

definePageMeta({
  middleware: 'admin',
  validate(route) {
    if (Array.isArray(route.params.postId)) return false
    if (route.params.postId === 'new') return true
    return /\d+/g.test(route.params.postId)
  }
})
const route = useRoute()
const postId = computed(() => {
  const pid = route.params.postId
  if (!pid || pid === 'new' || Array.isArray(pid)) return null
  return parseInt(pid)
})
const isCreating = computed(() => postId.value === null)

useHead(() => ({
  title: isCreating ? '記事の新規投稿' : `[${postId.value}] 記事の編集`
}))

const valid = ref(false)
const preview = ref(false)

type PostType = Pick<Post, 'title' | 'content' | 'publicStatus'> & {
  id: number | null
}

const rules = {
  required: [(value: string) => /\S+/.test(value) || 'このフィールドは必須です']
}

const post = ref<PostType>({
  id: null,
  title: '',
  content: '',
  publicStatus: 'private'
})
if (postId.value) {
  const { data } = await useApi(Posts.getPost, [postId.value])
  if (data.value)
    post.value = {
      id: data.value.id,
      title: data.value.title,
      content: data.value.content,
      publicStatus: data.value.publicStatus
    }
}

const statuses = Object.entries(STATUS_TABLE).map(([key, value]) => ({
  title: value,
  value: key
}))

const router = useRouter()
async function submit() {
  if (isCreating.value) {
    await useApi(
      Posts.createPost,
      [],
      {},
      {
        title: post.value.title,
        content: post.value.content,
        publicStatus: post.value.publicStatus
      }
    )
  } else {
    await useApi(
      Posts.updatePost,
      [postId.value!],
      {},
      {
        title: post.value.title,
        content: post.value.content,
        publicStatus: post.value.publicStatus
      }
    )
  }
  await router.push('/admin/posts')
}
</script>

<template>
  <v-card :loading="!post">
    <v-card-title class="text-h5">{{
      isCreating ? '新規記事の投稿' : '記事の編集'
    }}</v-card-title>
    <v-card-text>
      <v-form v-model="valid" @submit.prevent="submit">
        <v-row class="py-1">
          <v-col cols="12" md="8">
            <v-text-field
              v-model="post.title"
              :rules="rules.required"
              label="タイトル"
            />
          </v-col>
          <v-col cols="12" md="4">
            <v-select
              v-model="post.publicStatus"
              :items="statuses"
              label="公開状態"
            />
          </v-col>
        </v-row>
        <v-row justify="end">
          <v-btn
            class="mr-4"
            variant="text"
            width="auto"
            color="purple"
            @click="preview = true"
            >プレビュー</v-btn
          >
        </v-row>
        <v-row>
          <v-col cols="12" class="py-1">
            <v-textarea
              v-model="post.content"
              :rules="rules.required"
              label="内容"
              variant="outlined"
              auto-grow
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-btn block type="submit" color="primary">{{
              isCreating ? '投稿' : '更新'
            }}</v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
    <LazyMarkdownPreviewModal
      title="プレビュー"
      :markdown="post.content"
      :value="preview"
      @close="preview = false"
    />
  </v-card>
</template>

<style scoped lang="scss"></style>
