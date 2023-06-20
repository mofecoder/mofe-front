<script lang="ts" setup>
import { useUserStore } from '~/store/user'

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
        <p class="mb-4">ユーザ名とパスワードを入力してください。</p>
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
          <p class="mb-2">
            <NuxtLink to="/auth/signup">アカウントを作成する</NuxtLink>
          </p>
          <p>
            <NuxtLink to="/auth/reset-password"
              >パスワードを忘れた方はこちら</NuxtLink
            >
          </p>
          <v-btn
            type="submit"
            :disabled="!valid"
            color="primary"
            width="100%"
            class="mt-3"
          >
            ログインする
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>
