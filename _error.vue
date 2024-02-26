<script setup lang="ts">
definePageMeta({
  layout: false
})
const props = defineProps<{
  error?: any
}>()

const pageNotFound = ref('404 Not Found')
const otherError = ref('An error occurred')

useHead({
  title() {
    return props.error?.statusCode === 404
      ? pageNotFound.value
      : otherError.value
  }
})
</script>

<template>
  <v-app dark>
    <div v-if="error.message">{{ error.message }}</div>
    <div v-else-if="error.error">{{ error.error }}</div>
    <h1 v-if="error.statusCode === 404">
      {{ pageNotFound }}
    </h1>
    <h1 v-else>
      {{ otherError }}
    </h1>
    <NuxtLink to="/">Home page</NuxtLink>
  </v-app>
</template>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
