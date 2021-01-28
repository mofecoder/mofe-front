<template>
  <v-card flat>
    <v-card-title>記事一覧（編集）</v-card-title>
    <v-card-text>
      <v-data-table :headers="tableHeader" :items="items" :loading="!posts">
        <template v-slot:item.actions="{ item }">
          <v-icon small @click="edit(item.id)">mdi-pencil</v-icon>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { DataTableHeader } from 'vuetify'
import dayjs from 'dayjs'
import { Post, STATUS_TABLE } from '~/types/post'

@Component({ middleware: 'admin' })
export default class PageManagePost extends Vue {
  tableHeader: DataTableHeader[] = [
    { text: 'ID', value: 'id' },
    { text: 'タイトル', value: 'title' },
    { text: '公開状態', value: 'publicStatus' },
    { text: '作成日時', value: 'createdAt' },
    { text: '更新日時', value: 'updatedAt' },
    { text: '', value: 'actions' }
  ]

  posts: Post[] | null = null

  async fetch() {
    this.posts = await this.$api.Posts.index()
  }

  get items() {
    if (!this.posts) return []
    return this.posts.map((post) => {
      const { id, title, createdAt, updatedAt, publicStatus } = post
      return {
        id,
        title,
        publicStatus: STATUS_TABLE[publicStatus],
        createdAt: this.formatDate(createdAt),
        updatedAt: this.formatDate(updatedAt)
      }
    })
  }

  formatDate(date: Date): string {
    return dayjs(date).format('YYYY/MM/DD HH:mm')
  }

  edit(postId: 'new' | number) {
    this.$router.push({ path: `${postId}`, append: true })
  }
}
</script>

<style scoped lang="scss"></style>
