<template>
  <v-card class="wrapper">
    <v-card-title>その他の設定</v-card-title>
    <v-card-text>
      <v-checkbox v-model="publishPointValues" label="配点を公開する" />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator'

export default class ContestAdminSettingsCard extends Vue {
  publishPointValues = false
}
</script>

<style scoped>
.wrapper {
}
</style>
