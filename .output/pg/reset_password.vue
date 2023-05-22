<template>
  <v-card max-width="480px" class="mx-auto" :loading="loading">
    <v-card-title>パスワードリセット</v-card-title>
    <v-card-text v-if="isRequest">
      <v-form ref="form" v-model="valid" @submit.prevent="submit">
        <v-text-field
          v-model="email"
          type="email"
          counter="64"
          :rules="rules.email"
          label="メールアドレス"
          persistent-hint
          max-errors="2"
          required
        />
        <v-btn
          type="submit"
          :disabled="!valid"
          :loading="loading"
          color="primary"
          width="100%"
          class="mt-2"
        >
          パスワードをリセットする
        </v-btn>
      </v-form>
    </v-card-text>
    <v-card-text v-else>
      <v-form ref="form" v-model="valid" @submit.prevent="submit">
        <v-text-field
          v-model="password"
          type="password"
          counter="128"
          :rules="rules.password"
          label="新しいパスワード"
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
          パスワードをリセットする
        </v-btn>
        <p>
          パスワードがリセットされたらログインページにリダイレクトされます。
        </p>
      </v-form>
    </v-card-text>
    <v-snackbar v-model="error" :timeout="4000">
      {{ errorMessage }}
    </v-snackbar>
    <v-snackbar v-model="showMessage" :timeout="8000">
      {{ message }}
    </v-snackbar>
  </v-card>
</template>

<script lang="ts">
import { Component, Ref, Vue } from 'nuxt-property-decorator'
import { userStore } from '~/utils/store-accessor'
import { HttpError } from '~/utils/axios'

@Component({
  head: { title: '新規登録' }
})
export default class PageLogin extends Vue {
  @Ref('form')
  form: any

  valid: boolean = false
  name: string = ''
  email: string = ''
  password: string = ''
  passwordConfirm: string = ''
  error: boolean = false
  errorMessage: string = ''
  message: string = ''
  loading = false

  rules = {
    email: [
      (v: string) => !!v || 'このフィールドは必須です。',
      (v: string) =>
        !v ||
        /^([\w-]+\.)*[\w-]+@([a-zA-Z]\w*[a-zA-Z0-9]\.)+[a-zA-Z]+$/.test(v) ||
        'メールアドレスの形式が無効です。',
      (v: string) => !v || v.length <= 64 || 'メールアドレスが長すぎます。'
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

  get isRequest() {
    return !this.$route.query.token
  }

  get showMessage() {
    return !!this.message
  }

  set showMessage(v: boolean) {
    if (!v) this.message = ''
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

    const res = this.isRequest
      ? this.$api.Auth.resetPasswordRequest(this.email)
      : this.$api.Auth.resetPassword(
          this.$route.query.token as string,
          this.password,
          this.passwordConfirm
        )
    this.loading = true

    res
      .then((r) => {
        this.loading = false
        if (this.isRequest) this.message = r.message
        else this.$router.push('/login')
      })
      .catch((err: Error) => {
        this.loading = false
        if (err.message === 'Not logged in.') {
          this.errorMessage = '処理に失敗しました。'
          this.error = true
          ;(this.$refs.form as any).resetValidation()
          this.password = ''
          this.passwordConfirm = ''
        } else if (err instanceof HttpError) {
          const errors: string[] | string | undefined = err.response.data.errors
          console.log(errors)
          this.error = true
          if (typeof errors === 'undefined') {
            this.errorMessage = '処理に失敗しました。'
          } else if (typeof errors === 'string') {
            this.errorMessage = errors
          } else {
            this.errorMessage = errors.join('\n')
          }
        }
      })
  }
}
</script>

<style scoped lang="scss"></style>
