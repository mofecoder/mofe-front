<script setup lang="ts">
import { VChip } from 'vuetify/components'

const environments: Record<string, VChip['$props']> = {
  development: {
    color: 'red'
  },
  production: {}
}
let text = 'production'
let environment = {}
if (process.env.NODE_ENV === 'development') {
  text = 'Dev'
  environment = environments.development
}
const config = useRuntimeConfig()
let api = 'production'
if (config.public.apiBase.includes('localhost')) {
  api = 'Dev'
}
</script>

<template>
  <v-chip
    v-show="text !== 'production'"
    v-bind="environment"
    class="ml-1"
    variant="elevated"
    label
  >
    {{ text }}
    <span class="api">/ {{ api }} API</span>
  </v-chip>
</template>

<style scoped lang="scss">
.api {
  margin-left: 0.4em;
  font-size: 0.85em;
}
</style>
