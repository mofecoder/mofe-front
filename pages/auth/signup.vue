<script setup lang="ts">
import { VForm } from 'vuetify/components'
import { useUserStore } from '~/store/user'
import { passwordRules } from '~/constants/password'
import { checkPasswordFormat } from '~/utils/validation'

useHead({
  title: '新規登録'
})

const form = ref<VForm>()
const valid = ref(false)
const params = reactive({
  email: '',
  name: '',
  password: '',
  passwordConfirmation: ''
})
const error = ref('')

const user = toRefs(useUserStore()).user

const router = useRouter()
const route = useRoute()

const redirect = (replace = false) => {
  const redirectTo = route.query.redirect
  if (typeof redirectTo !== 'string' || redirectTo[0] !== '/') {
    if (replace) router.replace('/')
    router.push('/')
    return
  }

  if (replace) router.replace(redirectTo)
  else router.push(redirectTo)
}

if (user.value) {
  redirect()
}

const checkPasswordConfirm = (): boolean | string => {
  return (
    params.password === params.passwordConfirmation ||
    'パスワードが一致しません。'
  )
}
const rules = {
  email: [
    (v: string) => !!v || 'このフィールドは必須です。',
    (v: string) =>
      !v ||
      /^([\w-+]+\.)*[\w-+]+@([a-zA-Z]\w*[a-zA-Z0-9]\.)+[a-zA-Z]+$/.test(v) ||
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
      (v.length >= 3 && v.length <= 20) ||
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
    (v: string) => !v || checkPasswordFormat(v)
  ],
  passwordConfirm: [
    (v: string) => !!v || 'このフィールドは必須です。',
    checkPasswordConfirm
  ]
}

const userStore = useUserStore()
const submit = async () => {
  if (!form.value?.validate()) return
  const { ok, errors } = await userStore.signUp(
    params.email,
    params.name,
    params.password,
    params.passwordConfirmation
  )
  if (!ok) {
    error.value = errors?.join('\n') || 'エラーが発生しました。'
    return
  }
  redirect()
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
      {{ error }}
    </v-alert>
    <v-card max-width="480px" class="mx-auto">
      <v-card-title>新規登録</v-card-title>
      <v-card-text>
        <v-form
          ref="form"
          v-model="valid"
          class="form"
          @submit.prevent="submit"
        >
          <v-text-field
            v-model="params.email"
            type="email"
            counter="64"
            :rules="rules.email"
            label="メールアドレス"
            hint="大小文字区別なし"
            persistent-hint
            max-errors="2"
            required
            autocomplete="email"
          />
          <v-text-field
            v-model="params.name"
            counter="16"
            :rules="rules.name"
            label="ユーザ名"
            hint="半角英数3文字以上16文字以下 英字必須 大小文字区別なし"
            max-errors="2"
            persistent-hint
            required
            autocomplete="username"
          />
          <p>
            ※チームアカウントを登録する場合は、prefix を含め 20
            文字まで登録可能です
          </p>
          <v-text-field
            v-model="params.password"
            type="password"
            counter="128"
            :rules="rules.password"
            label="パスワード"
            hint="半角英数記号混合8文字以上128文字以下"
            max-errors="2"
            persistent-hint
            autocomplete="new-password"
            :asswordrules="passwordRules"
            required
          />
          <v-text-field
            v-model="params.passwordConfirmation"
            type="password"
            counter="128"
            :rules="rules.passwordConfirm"
            label="パスワードの確認"
            autocomplete="new-password"
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
    </v-card>
  </v-container>
</template>

<style scoped lang="scss">
.form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
