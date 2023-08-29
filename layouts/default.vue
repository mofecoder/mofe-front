<script lang="ts" setup>
import { useUserStore } from '~/store/user'

const userStore = useUserStore()
const user = computed(() => userStore.user)

const title = 'MOFE Beta'
const route = useRoute()
const createLink = (path: string) => ({
  path,
  query: {
    ...route.query,
    redirect: route.path.startsWith('/auth') ? undefined : route.path
  }
})
</script>
<template>
  <v-app>
    <v-app-bar flat color="brown-darken-1" class="header">
      <template #title>
        <v-btn :active="false" icon="mdi-home" to="/" />
        {{ title }}
        <EnvironmentChip />
      </template>
      <v-spacer />
      <ClientOnly>
        <template v-if="user">
          <v-btn
            variant="text"
            prepend-icon="mdi-account"
            class="text-none"
            :active="false"
            to="/user"
          >
            <span class="d-none d-sm-inline">
              {{ user.name }}
            </span>
          </v-btn>
        </template>
        <template v-else>
          <v-btn
            class="text-white"
            :active="false"
            :to="createLink('/auth/signup')"
            prepend-icon="mdi-account-plus"
            variant="text"
          >
            <span class="d-none d-sm-inline">新規登録</span>
          </v-btn>
          <v-btn
            class="text-white"
            :active="false"
            :to="createLink('/auth/signin')"
            variant="text"
            prepend-icon="mdi-login-variant"
          >
            <span class="d-none d-sm-inline">ログイン</span>
          </v-btn>
        </template>
      </ClientOnly>
    </v-app-bar>
    <v-main>
      <v-container>
        <slot />
      </v-container>
    </v-main>
    <v-footer app class="d-flex justify-center" absolute>
      <p class="mb-0 mr-3">Copyright 2020 CafeCoder & MOFE</p>
      <NuxtLink to="/privacy_policy">プライバシーポリシー</NuxtLink>
    </v-footer>
  </v-app>
</template>

<style lang="scss">
.header {
  align-items: center;

  &__link {
    color: white !important;
    text-decoration: inherit !important;
  }

  &__link-text {
    font-size: 1.5rem;
  }

  &__user-name {
    color: white;
    font-size: 1.2rem;
    align-self: center;
    text-decoration: none;
  }
}
</style>
