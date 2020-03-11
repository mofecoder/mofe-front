<template>
  <v-app>
    <v-app-bar
      :clipped-left="true"
      fixed
      flat
      app
      min-height="4rem"
      color="brown darken-1"
      style="align-items:center"
    >
      <v-row class="pl-8">
        <n-link to="/" style="color:white;text-decoration:inherit">
          <v-toolbar-title style="font-size:1.5rem" v-text="title" />
        </n-link>
        <v-spacer />
        <template v-if="user">
          <n-link
            class="header__user-name pr-8 white--text"
            style="text-decoration:none"
            to="/user"
            >{{ user.name }}</n-link
          >
        </template>
        <template v-else>
          <v-btn class="white--text" to="/sign_up" text>新規登録</v-btn>
          <v-btn class="white--text" to="/login" text>ログイン</v-btn>
        </template>
      </v-row>
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
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
  &__user-name {
    color: white;
    font-size: 1.2rem;
    align-self: center;
  }
}
</style>
