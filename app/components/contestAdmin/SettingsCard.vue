<template>
  <v-card class="wrapper">
    <v-card-title>その他の設定</v-card-title>
    <v-card-text>
      <v-checkbox
        v-model="publishPointValues"
        disabled
        label="配点を公開する"
      />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Vue } from 'nuxt-property-decorator'

export default class SettingsCard extends Vue {
  publishPointValues = false
}
</script>

<style scoped>
.wrapper {
}
</style>
