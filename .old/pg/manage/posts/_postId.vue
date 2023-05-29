<template>
  <v-card :loading="loading">
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
              isCreating ? '投稿' : '確定'
            }}</v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
    <MarkdownPreviewModal
      title="プレビュー"
      :markdown="post.content"
      :value="preview"
      @close="preview = false"
    />
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { Post, STATUS_TABLE } from '~/types/post'
import MarkdownPreviewModal from '../../../comp/modals/MarkdownPreviewModal.vue'

type TypePost = Pick<Post, 'title' | 'content' | 'publicStatus'> & {
  id: number | null
}

@Component({
  components: { MarkdownPreviewModal },
  middleware: 'admin',
  validate({ route }) {
    return /^(new|\d+)$/.test(route.params.postId)
  }
})
export default class PagePostEdit extends Vue {
  rules = {
    required: [(text: string) => /\S+/.test(text) || 'このフィールドは必須です']
  }

  loading = false
  preview = false
  valid = false
  post: TypePost = {
    id: null,
    title: '',
    content: '',
    publicStatus: 'private'
  }

  async fetch() {
    if (this.postId === null) return
    this.loading = true
    const res = await this.$api.Posts.show(this.postId)
    const { id, title, content, publicStatus } = res
    this.post = { id, title, content, publicStatus }
    this.loading = false
  }

  get postId() {
    const id = this.$route.params.postId
    return id === 'new' ? null : parseInt(id)
  }

  get isCreating() {
    return this.postId === null
  }

  get statuses() {
    return Object.entries(STATUS_TABLE).map((kv) => ({
      value: kv[0],
      text: kv[1]
    }))
  }

  submit() {
    const payload = { ...this.post, id: undefined }
    delete payload.id
    const res: Promise<any> =
      this.postId === null
        ? this.$api.Posts.create(payload)
        : this.$api.Posts.update(this.postId, payload)
    res
      .then(() => this.$router.push({ path: '..', append: true }))
      .catch(() => alert('投稿に失敗しました'))
  }
}
</script>

<style scoped lang="scss"></style>
