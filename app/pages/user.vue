<template>
  <v-card>
    <v-card-title>ユーザ情報</v-card-title>
    <v-card-text v-if="user">
      <v-row class="ml-0">ログイン中のユーザ: {{ user.name }}</v-row>
      <v-form ref="user" v-model="ok" @submit.prevent="submit">
        <v-text-field
          v-model="params.atcoderId"
          class="user-form__atcoder-id"
          label="AtCoder ID"
          :rules="rules"
        />
        <v-btn color="primary" type="submit">更新する</v-btn>
      </v-form>
      <v-row class="ml-0 mt-6">
        <v-btn color="red white--text" @click="logout">ログアウトする</v-btn>
      </v-row>
    </v-card-text>
    <v-snackbar v-model="showSnack" :timeout="4000">
      {{ message }}
    </v-snackbar>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { userStore } from '~/utils/store-accessor'

@Component({
  middleware: 'authenticated',
  head: { title: 'ユーザ情報' }
})
export default class PageUser extends Vue {
  ok = false
  params = {
    atcoderId: '' as string | null
  }

  message = ''

  readonly rules = [
    (v: string) => /^\w{1,16}$/.test(v) || 'AtCoder ID が無効です。'
  ]

  get user() {
    return userStore.getUser
  }

  get showSnack() {
    return !!this.message
  }

  set showSnack(v: boolean) {
    if (v) return
    this.message = ''
  }

  mounted() {
    this.params = {
      atcoderId: this.user!.atcoderId
    }
  }

  async submit() {
    await this.$api.Auth.updateUser(this.user!.id, this.params)
      .then(() => {
        this.message = 'ユーザ情報を更新しました'
      })
      .catch(() => {
        this.message = 'ユーザ情報の更新に失敗しました'
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
}
</style>
