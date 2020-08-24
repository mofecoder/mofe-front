<template>
  <v-app>
    <v-app-bar
      :clipped-left="true"
      fixed
      flat
      app
      min-height="4rem"
      color="brown darken-1"
      class="header"
    >
      <v-row class="pl-8">
        <n-link class="header__link" to="/">
          <v-toolbar-title class="header__link-text" v-text="title" />
        </n-link>
        <v-spacer />
        <template v-if="user">
          <n-link class="header__user-name pr-8 white--text" to="/user">{{
            user.name
          }}</n-link>
        </template>
        <template v-else>
          <v-btn class="white--text" to="/sign_up" text>新規登録</v-btn>
          <v-btn class="white--text" to="/login" text>ログイン</v-btn>
        </template>
      </v-row>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { userStore } from '~/utils/store-accessor'

@Component
export default class LayoutDefault extends Vue {
  title = 'CafeCoder'

  get user() {
    return userStore.getUser
  }
}
</script>

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
