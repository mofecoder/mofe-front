<script lang="ts" setup>
import { useUserStore } from '~/store/user'

const userStore = useUserStore()
const user = computed(() => userStore.user)

const title = 'MOFE'
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
    <nuxt-loading-indicator />
    <v-app-bar class="header" color="deep-orange-lighten-5">
      <template #prepend>
        <v-btn :active="false" icon="mdi-home" to="/" />
      </template>
      <template #title>
        {{ title }}
        <EnvironmentChip />
      </template>
      <template #append>
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
            <v-btn
              variant="text"
              prepend-icon="mdi-account"
              class="text-none"
              to="/user"
            >
              {{ user.name }}
            </v-btn>
          </div>
          <div v-else class="d-none d-md-flex align-center">
            <v-btn
              :to="createLink('/auth/signup')"
              prepend-icon="mdi-account-plus"
              variant="text"
            >
              新規登録
            </v-btn>
            <v-btn
              :to="createLink('/auth/signin')"
              variant="text"
              prepend-icon="mdi-login-variant"
            >
              ログイン
            </v-btn>
          </div>
        </ClientOnly>
      </template>
    </v-app-bar>
    <v-main style="--v-layout-top: 64px">
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
