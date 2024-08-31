<script lang="ts" setup>
const title = 'MOFE'
const dayjs = useDayjs()
const year = dayjs().year()
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
        <ToolbarUser />
      </template>
    </v-app-bar>
    <v-main style="--v-layout-top: 64px">
      <v-container>
        <slot />
      </v-container>
    </v-main>
    <v-footer
      app
      class="d-flex flex-column justify-center bg-grey-lighten-3"
      absolute
    >
      <p class="mb-0 mr-3">Copyright 2020 - {{ year }} CafeCoder & MOFE</p>
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
