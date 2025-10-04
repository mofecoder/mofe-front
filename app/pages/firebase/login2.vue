<script setup lang="ts">
import { useUserStore } from '~/store/user'

useHead({
  title: 'ログイン'
})

const auth = useFirebaseAuth()

const rules = {
  password: [(v: string) => !!v || 'このフィールドは必須です。'],
  email: [
    (v: string) => !!v || 'このフィールドは必須です。',
    (v: string) =>
      !v
      || /^([\w-+]+\.)*[\w-+]+@([a-zA-Z]\w*[a-zA-Z0-9]\.)+[a-zA-Z]+$/.test(v)
      || 'メールアドレスの形式が無効です。',
    (v: string) => !v || v.length <= 64 || 'メールアドレスが長すぎます。'
  ]
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

const email = ref<string>('')
const password = ref<string>('')
const error = ref<boolean>(false)
const valid = ref<boolean>(false)
const loading = ref<boolean>(false)

const submit = async () => {
  loading.value = true
  try {
    await auth.signInWithEmailAndPassword(email.value, password.value)
  } catch (err) {
    console.error(err)
    error.value = true
  }
  loading.value = false
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
      <v-card-title>Firebase ログイン</v-card-title>
      <v-card-text>
        <p class="mb-2">
          ユーザ名とパスワードを入力してください。
        </p>
        <p class="mb-4 text-caption">
          旧 CafeCoder (<code>https://cafecoder.top</code>)
          と同一のアカウントでログイン可能です。
        </p>
        <v-form ref="form" v-model="valid" @submit.prevent="submit">
          <v-text-field
            v-model="email"
            :rules="rules.email"
            label="メールアドレス"
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
              density="comfortable"
            >
              アカウントを作成する
            </v-btn>
            <v-btn
              to="/auth/reset-password"
              variant="outlined"
              color="warning"
              prepend-icon="mdi-lock-question"
              density="comfortable"
            >
              パスワードを忘れた場合
            </v-btn>
          </div>
          <v-btn
            type="submit"
            :disabled="!valid"
            :loading="loading"
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

<style scoped lang="scss">

</style>
