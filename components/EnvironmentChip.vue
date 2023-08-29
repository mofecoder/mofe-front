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
</script>

<template>
  <v-chip
    v-show="text !== 'production'"
    v-bind="environment"
    variant="elevated"
  >
    {{ text }}
  </v-chip>
</template>

<style scoped lang="scss"></style>
