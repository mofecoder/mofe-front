<script lang="ts" setup>
import { useTheme } from 'vuetify'

const title = 'MOFE'
useHead({
  title,
  titleTemplate: `%s | ${title}`,
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    {
      name: 'description',
      content: 'プログラミングコンテストサイト MOFE'
    }
  ],
  link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
})

const theme = useTheme()
if (process.client) {
  const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

  darkModeMediaQuery.addEventListener('change', (e) => {
    theme.global.name.value = e.matches ? 'dark' : 'light'
  })
}
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
