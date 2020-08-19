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

@Component({
  middleware: 'authenticated',
  head: { title: 'ユーザ情報' }
})
export default class PageUser extends Vue {
  get user() {
    return userStore.getUser
  }

  logout() {
    this.$api.Auth.signOut()
    userStore.updateUser(null)
    localStorage.removeItem('accessToken')
    localStorage.removeItem('uid')
    localStorage.removeItem('client')
    this.$router.push('/')
  }
}
</script>

<style scoped lang="scss"></style>
