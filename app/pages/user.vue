<script setup lang="ts">
import { useUserStore } from '~/store/user'
import Auth from '~/utils/apis/Auth'
import { definePageMeta } from '#imports'

definePageMeta({
  middleware: 'authenticated'
})

useHead({
  title: 'ユーザ情報'
})

const ok = ref(false)

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const params = reactive({
  atcoderId: user.value?.atcoderId,
  name: user.value?.name || ''
})

const rules = {
  atcoderId: [(v: string) => /^\w{1,16}$/.test(v) || 'AtCoder ID が無効です。'],
  name: (name: string) => [
    (v: string) =>
      v.toLowerCase() === name.toLowerCase() ||
      '大文字・小文字の変更のみ可能です。'
  ]
}

const message = ref('')

const canChangeName = computed(() => {
  if (!user.value) return false
  return user.value.name === user.value.name.toLowerCase()
})

const nameRules = computed(() => rules.name(user.value?.name || ''))

const showSnack = computed({
  get: () => !!message.value,
  set: (v) => {
    if (!v) message.value = ''
  }
})

const submit = async () => {
  const { error } = await useApi(Auth.updateUser, [user.value!.id], {}, params)
  if (error.value) {
    message.value = 'ユーザ情報の更新に失敗しました。'
    return
  }
  await userStore.fetchUser(true)
  message.value = 'ユーザ情報を更新しました。'
}

const router = useRouter()
const signOut = async () => {
  await userStore.signOut()
  await router.replace({ path: '/', query: { 'signed-out': null } })
}
</script>

<template>
  <v-card>
    <v-card-title>ユーザ情報</v-card-title>
    <v-card-text v-if="user">
      <p>ログイン中のユーザ: {{ user.name }}</p>
      <v-form v-model="ok" @submit.prevent="submit">
        <v-text-field
          v-model="params.atcoderId"
          class="user-form__atcoder-id"
          label="AtCoder ID"
          :rules="rules.atcoderId"
        />
        <v-text-field
          v-model="params.name"
          :readonly="!canChangeName"
          class="user-form__name"
          label="名前"
          :rules="nameRules"
          hint="名前の大文字・小文字の変更ができます。名前の変更は1度のみ可能です。"
        />
        <v-btn class="mt-3" color="primary" type="submit">更新する</v-btn>
      </v-form>
      <div class="ml-0 mt-6">
        <v-btn
          color="red white--text"
          variant="tonal"
          prepend-icon="mdi-logout-variant"
          @click="signOut"
          >ログアウトする</v-btn
        >
      </div>
    </v-card-text>
    <v-snackbar v-model="showSnack" :timeout="4000">
      {{ message }}
    </v-snackbar>
  </v-card>
</template>

<style scoped lang="scss"></style>
