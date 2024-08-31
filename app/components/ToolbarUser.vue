<script setup lang="ts">
import { useTheme } from 'vuetify'
import { useUserStore } from '~/store/user'

defineProps<{
  role?: string
}>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const route = useRoute()

const createLink = (path: string) => ({
  path,
  query: {
    ...route.query,
    redirect: route.path.startsWith('/auth') ? undefined : route.path
  }
})

const theme = useTheme()
const changeTheme = () => {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}
const dark = computed(() => theme.current.value.dark)
const router = useRouter()

const signOut = async () => {
  await userStore.signOut()
  await router.replace({ path: '/', query: { 'signed-out': null } })
}
</script>

<template>
  <ClientOnly>
    <div class="d-md-none">
      <template v-if="user">
        <v-btn variant="text" icon="mdi-account" to="/user" />
      </template>
      <template v-else>
        <v-btn
          variant="text"
          icon="mdi-account-plus"
          :to="createLink('/auth/signup')"
        />
        <v-btn
          variant="text"
          icon="mdi-login-variant"
          :to="createLink('/auth/signin')"
        />
      </template>
    </div>
    <div v-if="user" class="d-none d-md-flex flex-column align-center">
      <v-overlay
        location-strategy="connected"
        scroll-strategy="reposition"
        close-on-content-click
      >
        <template #activator="{ props }">
          <v-btn
            variant="text"
            prepend-icon="mdi-account"
            class="text-none"
            v-bind="props"
          >
            {{ user.name }}
          </v-btn>
        </template>
        <v-sheet rounded>
          <v-list density="compact" slim nav>
            <v-list-item
              prepend-icon="mdi-account-edit"
              title="アカウント設定"
              to="/user"
            />
            <v-list-item
              v-if="user.role === 'admin'"
              prepend-icon="mdi-security"
              title="管理ページ"
              to="/admin"
            />
            <v-list-item
              v-if="user.role === 'admin'"
              prepend-icon="mdi-application-cog"
              title="コンテスト管理"
              to="/manage/contests"
            />
            <v-list-item
              v-if="user.role === 'writer' || user.role === 'admin'"
              prepend-icon="mdi-text-box-multiple-outline"
              title="問題管理"
              to="/manage/problems"
            />
            <v-divider />
            <v-list-item
              prepend-icon="mdi-theme-light-dark"
              @click="changeTheme"
            >
              <template #title>
                テーマ: {{ dark ? 'ダーク (Beta)' : 'ライト' }}
              </template>
            </v-list-item>
            <v-divider />
            <v-list-item
              prepend-icon="mdi-logout"
              title="ログアウト"
              @click="signOut"
            />
          </v-list>
        </v-sheet>
      </v-overlay>
      <p v-if="role" class="text-caption">({{ role }})</p>
    </div>
    <div v-else class="d-none d-md-flex align-center">
      <v-btn
        :to="createLink('/auth/signup')"
        prepend-icon="mdi-account-plus"
        variant="text"
        >新規登録</v-btn
      >
      <v-btn
        :to="createLink('/auth/signin')"
        variant="text"
        prepend-icon="mdi-login-variant"
        >ログイン</v-btn
      >
    </div>
  </ClientOnly>
</template>

<style scoped lang="scss"></style>
