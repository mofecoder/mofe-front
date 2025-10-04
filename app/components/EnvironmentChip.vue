<script setup lang="ts">
import { VChip } from 'vuetify/components'

const environments = {
  development: {
    color: 'orange'
  },
  devProdApi: {
    color: 'red'
  },
  production: {}
} satisfies Record<string, VChip['$props']>

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
    class="ml-1"
    variant="elevated"
    label
  >
    {{ text }}
  </v-chip>
</template>

<style scoped lang="scss">
.api {
  margin-left: 0.4em;
  font-size: 0.85em;
}
</style>
