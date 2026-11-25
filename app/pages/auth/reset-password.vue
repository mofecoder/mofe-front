<script lang="ts" setup>
import { VForm } from 'vuetify/components'
import { checkPasswordFormat } from '~/utils/validation'
import { useUserStore } from '~/store/user'
import { authApi } from '~/utils/apis'

const router = useRouter()
const route = useRoute()
const resetToken = computed(() => {
  if (!route.query.token || Array.isArray(route.query.token)) return null
  return route.query.token
})

useHead(() => ({
  title: 'パスワードの変更'
}))

const params = reactive({
  email: '',
  password: '',
  passwordConfirmation: ''
})
const checkPasswordConfirm = (): boolean | string => {
  return (
    params.password === params.passwordConfirmation ||
    'パスワードが一致しません。'
  )
}

const userStore = useUserStore()

if (userStore.user) {
  router.push('/')
}

const error = ref('')
const message = ref('')
const loading = ref(false)
const form = ref<VForm>()

const authRepo = authApi()

// パスワード変更は統一エラー形式 ({ error })、
// リセットメールの送信は devise_token_auth の形式 ({ errors: [] }) で返る
const handleError = (e: unknown) => {
  const data = getApiError(e) as { errors?: unknown } | undefined
  error.value = Array.isArray(data?.errors)
    ? data.errors.join('\n')
    : getErrorMessage(e, '処理に失敗しました。')
  loading.value = false
}

const submit = async () => {
  if (!form.value?.validate) return
  loading.value = true

  if (resetToken.value) {
    try {
      await authRepo.resetPassword({
        user: {
          password: params.password,
          passwordConfirmation: params.passwordConfirmation,
          resetPasswordToken: resetToken.value
        }
      })
    } catch (e) {
      handleError(e)
      return
    }
    await router.push('/auth/signin')
  } else {
    let res
    try {
      res = await authRepo.resetPasswordRequest({
        email: params.email,
        redirectUrl: '/auth/reset-password'
      })
    } catch (e) {
      handleError(e)
      return
    }
    loading.value = false
    message.value = res.message
  }
}
const valid = ref(false)
const showMessage = computed({
  get: () => !!message.value,
  set: () => {
    message.value = ''
  }
})

const rules = {
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
    (v: string) => !v || checkPasswordFormat(v)
  ],
  passwordConfirm: [
    (v: string) => !!v || 'このフィールドは必須です。',
    checkPasswordConfirm
  ]
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
      >{{ error }}</v-alert
    >
    <v-card max-width="480px" class="mx-auto" :loading="loading">
      <v-card-title>パスワードリセット</v-card-title>
      <v-card-text v-if="!resetToken">
        <div class="mb-4">
          アカウントに登録されたメールアドレスにパスワードリセットのリンクを送信します。
          メールが届かない場合には、メールアドレスが正しいかどうかを確認してください。
        </div>
        <v-form ref="form" v-model="valid" @submit.prevent="submit">
          <v-text-field
            v-model="params.email"
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
            v-model="params.password"
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
            v-model="params.passwordConfirmation"
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
          <p class="mt-4">
            パスワードがリセットされたらログインページにリダイレクトされます。
          </p>
        </v-form>
      </v-card-text>
      <v-snackbar v-model="showMessage" :timeout="8000">
        {{ message }}
      </v-snackbar>
    </v-card>
  </v-container>
</template>

<style scoped lang="scss"></style>
