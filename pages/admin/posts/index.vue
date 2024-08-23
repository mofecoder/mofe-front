<script setup lang="ts">
import Posts from '~/utils/apis/Posts'
import { formatDate } from '~/utils/formatting'
import { STATUS_TABLE } from '~/constants/posts'
import { definePageMeta } from '#imports'

definePageMeta({
  middleware: 'admin',
  layout: 'top'
})

useHead({
  title: '記事の管理'
})

const tableHeader = [
  { title: 'ID', key: 'id' },
  { title: 'タイトル', key: 'title' },
  { title: '公開状態', key: 'publicStatus' },
  { title: '作成日時', key: 'createdAt' },
  { title: '更新日時', key: 'updatedAt' },
  { title: '', key: 'actions' }
]

const { data: posts } = await useApi(Posts.getPosts, [])
const items = computed(() => {
  if (!posts.value) return []
  return posts.value.map((post) => {
    const { id, title, createdAt, updatedAt, publicStatus } = post
    return {
      id,
      title,
      publicStatus: STATUS_TABLE[publicStatus],
      createdAt: formatDate(createdAt),
      updatedAt: formatDate(updatedAt)
    }
  })
})
</script>

<template>
  <v-card flat>
    <v-card-title>記事一覧（編集）</v-card-title>
    <v-card-text>
      <v-btn
        color="purple white--text"
        variant="tonal"
        to="/admin/posts/new"
        prepend-icon="mdi-note-plus"
        >新規記事作成</v-btn
      >
      <v-data-table :headers="tableHeader" :items="items" :loading="!posts">
        <template #item.actions="{ item }">
          <v-btn
            size="small"
            icon
            variant="text"
            :to="`/admin/posts/${item.id}`"
          >
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<style scoped lang="scss"></style>
