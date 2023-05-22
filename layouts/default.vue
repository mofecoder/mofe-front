<script lang="ts" setup>
import { useUserStore } from '~/store/user'

const userStore = useUserStore()
const user = computed(() => userStore.getUser)

const title = 'CafeCoder'
</script>
<template>
  <v-app>
    <v-app-bar flat color="brown-darken-1" class="header">
      <v-row class="pl-8">
        <NuxtLink class="header__link" to="/">
          <v-toolbar-title class="header__link-text" :text="title" />
        </NuxtLink>
        <v-spacer />
        <template v-if="user">
          <NuxtLink class="header__user-name pr-8 text-white" to="/user">{{
            user.name
          }}</NuxtLink>
        </template>
        <template v-else>
          <v-btn class="text-white" to="/sign_up" variant="text">
            新規登録
          </v-btn>
          <v-btn class="text-white" to="/login" variant="text">ログイン</v-btn>
        </template>
      </v-row>
    </v-app-bar>
    <v-main>
      <v-container>
        <slot />
      </v-container>
    </v-main>
    <v-footer app class="d-flex justify-center" absolute>
      <p class="mb-0 mr-3">Copyright 2020 CafeCoder</p>
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
