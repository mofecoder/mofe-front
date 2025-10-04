<script setup lang="ts">
import { useUserStore } from '~/store/user'

useHead({
  title: 'ログイン'
})

const { signInWithEmailAndPassword } = useFirebaseAuth()

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const redirectPath = computed(() => {
  const tmp = route.query.redirect
  return typeof tmp === 'string' ? tmp : '/'
})

const errorMessages = {
  invalidCredential: 'メールアドレスまたはパスワードが間違っています。',
  providerFail: 'ログインに失敗しました。',
  accountExistsWithDifferentCredential: '同一のメールアドレスのアカウントが存在します。ログインしてからアカウントをリンクしてください。',
  unknownError: 'ログインに失敗しました。'
}

const valid = ref(false)
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref<string>()

const rules = {
  required: [(v: string) => !!v || 'このフィールドは必須です。']
}

/*
async function signInWithProvider(provider: AuthProvider) {
  console.log('signing in')
  await signInWithPopup(provider).then(async (result) => {
    console.log(result)
    await signInProcess(result)
    await router.push(redirectPath.value)
  }).catch((err) => {
    console.table(Object.entries(err))
    if (err.code === 'auth/cancelled-popup-request') return
    console.log(err.code)
    if (err.code === 'auth/account-exists-with-different-credential') {
      error.value = errorMessages.accountExistsWithDifferentCredential
    } else {
      error.value = `${errorMessages.providerFail} (${err.message})`
    }
  }).finally(() => console.log('complete'))
  // sessionStorage.setItem('redirect', redirectPath.value)
  // router.push(`/auth/callback/${provider}`)
}
*/

async function submit() {
  loading.value = true
  try {
    await signInWithEmailAndPassword(email.value, password.value)
    await userStore.fetchUser()
    await router.push(redirectPath.value)
  } catch (err) {
    error.value = errorMessages.invalidCredential
    console.error(err)
  }
  loading.value = false
}
</script>

<template>
  <v-container class="align-center">
    <v-alert
      v-if="error"
      max-width="540px"
      class="mx-auto mb-6"
      type="error"
      variant="tonal"
    >
      {{ error }}
    </v-alert>
    <v-card class="mx-auto" max-width="540px" :loading="loading">
      <v-card-title>ログイン</v-card-title>
      <v-card-text>
        <v-form v-model="valid" @submit.prevent="submit">
          <v-text-field v-model="email" class="mt-2 mb-4" type="email" label="メールアドレス" autocomplete="username" :rules="rules.required" />
          <v-text-field v-model="password" type="password" label="パスワード" autocomplete="password" :rules="rules.required" />
          <div class="d-flex justify-end ga-4">
            <v-btn variant="text">
              アカウントを作成
            </v-btn>
            <v-btn :disabled="!valid" type="submit">
              ログイン
            </v-btn>
          </div>
        </v-form>
        <p class="mt-4 text-caption">
          ユーザ名ではログインできなくなりました。メールアドレスを使用してください。
        </p>
        <p class="mt-2 text-caption">
          旧 CafeCoder (<code>https://cafecoder.top</code>)
          と同一のアカウントでログイン可能です。
        </p>

        <!--
        <v-divider class="my-4" />
        <v-btn class="text-capitalize" block :prepend-icon="googleIcon" text color="white" @click="signInWithProvider('google')">
          Google でログイン
        </v-btn>
        <v-btn
          class="mt-4 text-capitalize" block :prepend-icon="githubIcon" text color="black" @click="signInWithProvider('github')"
        >
          GitHub でログイン
        </v-btn>
        -->
      </v-card-text>
    </v-card>
  </v-container>
</template>
