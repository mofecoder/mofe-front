<template>
  <v-card>
    <v-card-title>ユーザ情報</v-card-title>
    <v-card-text v-if="user">
      <p>ログイン中のユーザ: {{ user.name }}</p>
      <template v-if="user.role !== 'member'"></template>
      <template v-else-if="user.writerRequestCode">
        <v-text-field
          label="Writer リクエストコマンド"
          :value="command"
          readonly
        />
        <p>Writer Slack で上記のコマンドを実行してください。</p>
      </template>
      <v-btn
        v-else
        class="user-form__writer-request"
        color="secondary"
        @click="request"
        >Writer リクエストを発行</v-btn
      >
      <v-form ref="user" v-model="ok" @submit.prevent="submit">
        <v-text-field
          v-model="params.atcoderId"
          class="user-form__atcoder-id"
          label="AtCoder ID"
          :rules="rules.atcoderId"
        />
        <v-text-field
          v-model="params.name"
          :disabled="!nameChangeable"
          class="user-form__name"
          label="名前"
          :rules="nameRules"
        />
        <p>
          名前の大文字・小文字の変更ができます。名前の変更は1度のみ可能です。
        </p>
        <v-btn class="mt-3" color="primary" type="submit">更新する</v-btn>
      </v-form>
      <div class="ml-0 mt-6">
        <v-btn color="red white--text" @click="logout">ログアウトする</v-btn>
      </div>
    </v-card-text>
    <v-snackbar v-model="showSnack" :timeout="4000">
      {{ message }}
    </v-snackbar>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { userStore } from '~/utils/store-accessor'
import { HttpError } from '~/utils/axios'

@Component({
  middleware: 'authenticated',
  head: { title: 'ユーザ情報' }
})
export default class PageUser extends Vue {
  ok = false
  params = {
    atcoderId: '' as string | null,
    name: ''
  }

  message = ''

  readonly rules = {
    atcoderId: [
      (v: string) => /^\w{1,16}$/.test(v) || 'AtCoder ID が無効です。'
    ]
  }

  get user() {
    return userStore.getUser
  }

  get showSnack() {
    return !!this.message
  }

  get command() {
    if (!this.user) return ''
    return `/register_writer ${this.user.name} ${this.user.writerRequestCode}`
  }

  get nameChangeable() {
    return this.user!.name === this.user!.name.toLowerCase()
  }

  get nameRules() {
    return [
      (v: string) =>
        v.toLowerCase() === this.user!.name.toLowerCase() ||
        '大文字・小文字の変更のみ可能です。'
    ]
  }

  set showSnack(v: boolean) {
    if (v) return
    this.message = ''
  }

  mounted() {
    this.params = {
      atcoderId: this.user!.atcoderId,
      name: this.user!.name
    }
  }

  async submit() {
    await this.$api.Auth.updateUser(this.user!.id, this.params)
      .then(async () => {
        await userStore.fetchUser()
        this.message = 'ユーザ情報を更新しました'
      })
      .catch((err: HttpError) => {
        this.message =
          err.response?.data?.error || 'ユーザ情報の更新に失敗しました'
      })
  }

  async request() {
    await this.$api.Users.generateWriterRequestCode(this.user!.id)
      .then(userStore.fetchUser)
      .catch((err: HttpError) => {
        this.message =
          err.response?.data?.error || 'Writer リクエストが発行できませんでした'
      })
  }

  logout() {
    this.$api.Auth.signOut()
    userStore.updateUser(null)
    localStorage.removeItem('accessToken')
    localStorage.removeItem('uid')
    localStorage.removeItem('client')
    this.$router.push('/')
  }
}
</script>

<style scoped lang="scss">
.user-form {
  &__atcoder-id {
    width: 10em;
  }
  &__name {
    width: 14em;
  }
  &__writer-request {
    text-transform: none;
  }
}
</style>
