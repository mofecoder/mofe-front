<script lang="ts" setup>
import { useUserStore } from '~/store/user'

useHead({
  title: 'ログイン'
})

const rules = {
  name: [
    (v: string) => !!v || 'このフィールドは必須です。',
    (v: string) => (v && /^\w+$/.test(v)) || 'ユーザ名の形式が無効です。'
  ],
  password: [(v: string) => !!v || 'このフィールドは必須です。']
}

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()
const redirect = () => {
  const s = route.query.redirect
  if (typeof s === 'string' && s[0] === '/') {
    router.replace(s)
  } else {
    router.replace('/')
  }
}
if (userStore.user) {
  redirect()
}

const name = ref<string>('')
const password = ref<string>('')
const error = ref<boolean>(false)
const valid = ref<boolean>(false)

const submit = async () => {
  const res = await userStore.signIn(name.value, password.value)
  if (res.ok) {
    redirect()
  } else {
    error.value = true
  }
}
</script>

<template>
  <v-container>
    <v-alert
      v-if="error"
      max-width="480px"
      class="mx-auto mb-6"
      type="error"
      variant="tonal"
    >
      ユーザ名またはパスワードが違います。
    </v-alert>
    <v-card max-width="480px" class="mx-auto">
      <v-card-title>ログイン</v-card-title>
      <v-card-text>
        <p class="mb-2">ユーザ名とパスワードを入力してください。</p>
        <p class="mb-4 text-caption">
          旧 CafeCoder (<code>https://cafecoder.top</code>)
          と同一のアカウントでログイン可能です。
        </p>
        <v-form ref="form" v-model="valid" @submit.prevent="submit">
          <v-text-field
            v-model="name"
            :rules="rules.name"
            label="ユーザ名"
            required
            autocomplete="username"
          />
          <v-text-field
            v-model="password"
            type="password"
            :rules="rules.password"
            label="パスワード"
            required
            autocomplete="current-password"
          />
          <div class="d-flex ga-3 my-4 flex-column">
            <v-btn
              to="/auth/signup"
              variant="outlined"
              prepend-icon="mdi-account-plus"
            >
              アカウントを作成する
            </v-btn>
            <v-btn
              to="/auth/reset-password"
              variant="outlined"
              color="warning"
              prepend-icon="mdi-lock-question"
            >
              パスワードを忘れた場合
            </v-btn>
          </div>
          <v-btn
            type="submit"
            :disabled="!valid"
            color="primary"
            block
            prepend-icon="mdi-login"
            class="mt-3"
          >
            ログインする
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>
