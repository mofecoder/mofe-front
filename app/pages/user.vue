<template>
  <v-card>
    <v-card-title>ユーザ情報</v-card-title>
    <v-card-text v-if="user">
      <v-row class="ml-0">ログイン中のユーザ: {{ user.name }}</v-row>
      <v-row class="ml-0 mt-4">
        <v-btn color="secondary" @click="logout">ログアウトする</v-btn>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { userStore } from '~/utils/store-accessor'

@Component
export default class PageUser extends Vue {
  get user() {
    return userStore.getUser
  }

  logout() {
    userStore.updateUser(null)
    this.$router.push('/')
  }

  mounted() {
    if (!this.user) this.$router.replace('/login')
  }
}
</script>

<style scoped lang="scss"></style>
