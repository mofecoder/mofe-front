<template>
  <v-card max-width="480px" class="mx-auto">
    <v-card-title>新規登録</v-card-title>
    <v-card-text>
      <v-form ref="form" v-model="valid" @submit.prevent="submit">
        <v-text-field
          v-model="email"
          type="email"
          counter="64"
          :rules="rules.email"
          label="メールアドレス"
          hint="大小文字区別なし"
          persistent-hint
          max-errors="2"
          required
        />
        <v-text-field
          v-model="name"
          counter="16"
          :rules="rules.name"
          label="ユーザ名"
          hint="半角英数3文字以上16文字以下 英字必須 大小文字区別なし"
          max-errors="2"
          persistent-hint
          required
        />
        <v-text-field
          v-model="password"
          type="password"
          counter="128"
          :rules="rules.password"
          label="パスワード"
          hint="半角英数記号混合8文字以上128文字以下"
          max-errors="2"
          persistent-hint
          required
        />
        <v-text-field
          v-model="passwordConfirm"
          type="password"
          counter="128"
          :rules="rules.passwordConfirm"
          label="パスワードの確認"
          required
        />
        <v-btn
          type="submit"
          :disabled="!valid"
          color="primary"
          width="100%"
          class="mt-2"
        >
          新規登録する
        </v-btn>
      </v-form>
    </v-card-text>
    <v-snackbar v-model="error" :timeout="4000">
      {{ errorMessage }}
    </v-snackbar>
  </v-card>
</template>

<script lang="ts">
import { Component, Ref, Vue } from 'nuxt-property-decorator'
import { userStore } from '~/utils/store-accessor'
import { HttpError } from '~/composables/useHttp'
import {} from '@nuxtjs/vuetify'

@Component({
  head: { title: '新規登録' }
})
export default class PageLogin extends Vue {
  @Ref('form')
  form: any

  valid: boolean = false
  name: string = ''
  password: string = ''
  passwordConfirm: string = ''
  email: string = ''
  error: boolean = false
  errorMessage: string = ''
  rules = {
    email: [
      (v: string) => !!v || 'このフィールドは必須です。',
      (v: string) =>
        !v ||
        /^([\w-]+\.)*[\w-]+@([a-zA-Z]\w*[a-zA-Z0-9]\.)+[a-zA-Z]+$/.test(v) ||
        'メールアドレスの形式が無効です。',
      (v: string) => !v || v.length <= 64 || 'メールアドレスが長すぎます。'
    ],
    name: [
      (v: string) => !!v || 'このフィールドは必須です。',
      (v: string) =>
        !v ||
        (/^\w+$/.test(v) && /[a-zA-Z]/.test(v)) ||
        'ユーザ名の形式が無効です。',
      (v: string) =>
        !v ||
        (v.length >= 3 && v.length <= 16) ||
        'ユーザ名が短すぎるか長すぎます。'
    ],
    password: [
      (v: string) => !!v || 'このフィールドは必須です。',
      (v: string) =>
        !v ||
        /^[a-zA-Z0-9!"#$%&'()*+,\-./:;<=>?@\\[\]^_`{}|~]+$/.test(v) ||
        'パスワードの形式が無効です。',
      (v: string) =>
        !v ||
        (v.length >= 8 && v.length <= 128) ||
        'パスワードが短すぎるか長過ぎます。',
      (v: string) => !v || this.checkPasswordFormat(v)
    ],
    passwordConfirm: [
      (v: string) => !!v || 'このフィールドは必須です。',
      this.checkPasswordConfirm
    ]
  }

  checkPasswordFormat(v: string) {
    const regex = [
      /[a-z]/g,
      /[A-Z]/g,
      /[\d]/g,
      /[!"#$%&'()*+,\-./:;<=>?@\\[\]^_`{}|~]/g
    ]
    return (
      regex
        .map((r) => (r.test(v) ? 1 : 0))
        .reduce((a, b) => a + b, 0 as number) >= 3 ||
      '英小文字、英大文字、数字、記号のうち3つ以上が含まれている必要があります。'
    )
  }

  checkPasswordConfirm(): boolean | string {
    return (
      this.password === this.passwordConfirm || 'パスワードが一致しません。'
    )
  }

  beforeCreate() {
    if (userStore.getUser) this.$router.replace('/')
  }

  submit() {
    if (!this.form.validate()) return

    this.$api.Auth.signUp(
      this.email,
      this.name,
      this.password,
      this.passwordConfirm
    )
      .then(this.redirect)
      .catch((err: Error) => {
        if (err.message === 'Not logged in.') {
          this.error = true
          ;(this.$refs.form as any).resetValidation()
          this.password = ''
        } else if (err instanceof HttpError) {
          const errors: string[] | string | undefined =
            err.response.data.errors.fullMessages
          this.error = true
          if (typeof errors === 'undefined') {
            this.errorMessage = 'ユーザ登録に失敗しました。'
          } else if (typeof errors === 'string') {
            this.errorMessage = errors
          } else {
            this.errorMessage = errors.join('\n')
          }
        }
      })
  }

  redirect() {
    // TODO: redirect先を持つ
    this.$router.push('/')
  }
}
</script>

<style scoped lang="scss"></style>
