<script setup lang="ts">
definePageMeta({
  validate(route) {
    const prov = route.params.provider
    return typeof prov === 'string' && (AuthProviders as readonly string[]).includes(prov)
  }
})

const { signInWithGoogle, signInWithGitHub, signInProcess, getRedirectResult } = useFirebaseAuth()
const router = useRouter()
const provider = useRoute().params.provider as AuthProvider

const redirectPath = sessionStorage.getItem('redirect') ?? '/'
sessionStorage.removeItem('redirect')

const error = ref<string | null>(null)
const loading = ref(true)

onMounted(async () => {
  try {
    const result = await getRedirectResult()
    console.log(result)
    if (result) {
      await signInProcess(result)
      await router.push(redirectPath)
      return
    }

    if (provider === 'google') await signInWithGoogle()
    else if (provider === 'github') await signInWithGitHub()
  } catch (err) {
    console.error('Authentication redirect error:', err)
    error.value = 'ログインに失敗しました。もう一度お試しください。'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <v-container class="d-flex align-center justify-center" style="height: 100vh;">
    <v-card v-if="loading" class="text-center pa-4" max-width="400">
      <v-progress-circular indeterminate color="primary" class="mb-4" />
      <div>ログイン中...</div>
    </v-card>
    <v-card v-else-if="error" class="text-center pa-4" max-width="400">
      <v-alert type="error">
        {{ error }}
      </v-alert>
      <v-btn class="mt-4" to="/firebase/login">
        ログインページに戻る
      </v-btn>
    </v-card>
  </v-container>
</template>

<style scoped lang="scss">

</style>
