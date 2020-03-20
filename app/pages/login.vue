<template>
  <v-card max-width="480px" class="mx-auto">
    <v-card-title>ログイン</v-card-title>
    <v-card-text>
      <div class="mb-4" :class="error ? 'red--text' : 'blue--text'">
        {{
          error
            ? 'ユーザ名またはパスワードが違います。'
            : 'ユーザ名とパスワードを入力してください。'
        }}
      </div>
      <v-form ref="form" v-model="valid" @submit.prevent="submit">
        <v-text-field
          v-model="name"
          :rules="rules.name"
          label="ユーザ名"
          required
        />
        <v-text-field
          v-model="password"
          type="password"
          :rules="rules.password"
          label="パスワード"
          required
        />
        <v-btn
          type="submit"
          :disabled="!valid"
          color="primary"
          width="100%"
          class="mt-2"
        >
          ログインする
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Ref, Vue } from 'nuxt-property-decorator'
import { userStore } from '~/utils/store-accessor'

@Component
export default class PageLogin extends Vue {
  valid: boolean = false
  name: string = ''
  password: string = ''
  error: boolean = false
  err: any = null
  @Ref() form!: {
    resetValidation(): void
  }

  rules = {
    name: [
      (v: string) => !!v || 'このフィールドは必須です。',
      (v: string) =>
        (v && /^[a-zA-Z\d]+$/.test(v)) || 'ユーザ名の形式が無効です。'
    ],
    password: [(v: string) => !!v || 'このフィールドは必須です。']
  }

  beforeCreate() {
    if (userStore.getUser) this.$router.replace('/')
  }

  submit() {
    this.$api.Auth.signIn(this.name, this.password)
      .then(this.redirect)
      .catch((err: Error) => {
        if (err.message === 'Not logged in.') {
          this.error = true
          this.form.resetValidation()
          this.password = ''
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
