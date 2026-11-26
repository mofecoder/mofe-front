<script setup lang="ts">
defineEmits<{
  click: []
}>()
</script>

<template>
  <v-btn
    class="mr-0"
    variant="text"
    width="auto"
    density="comfortable"
    prepend-icon="mdi-file-find-outline"
    color="purple"
    @click="$emit('click')"
  >
    プレビュー
  </v-btn>
</template>

<style scoped lang="scss">

</style>
