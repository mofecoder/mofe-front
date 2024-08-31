<script setup lang="ts">
const props = defineProps<{
  atcoderId: string | null
  rating: number | null
  text?: string
  defaultColor?: string
}>()

const atcoderColor = (rating: number | null) => {
  if (rating === null) return props.defaultColor || '#5200ab'
  if (rating === 0) return '#000000'
  switch (Math.floor(rating / 400)) {
    case 0:
      return '#808080'
    case 1:
      return '#804000'
    case 2:
      return '#008000'
    case 3:
      return '#00c0c0'
    case 4:
      return '#0000ff'
    case 5:
      return '#c0c000'
    case 6:
      return '#ff8000'
    default:
      return '#ff0000'
  }
}
</script>

<template>
  <a
    v-if="atcoderId"
    class="atcoder-link"
    :href="`https://atcoder.jp/users/${atcoderId}`"
    target="_blank"
    :style="{ color: atcoderColor(rating) }"
  >
    <template v-if="text">{{ text }}</template>
    <template v-else><slot /></template>
  </a>
  <span v-else>
    <template v-if="text">{{ text }}</template>
    <template v-else><slot /></template>
  </span>
</template>

<style scoped lang="scss">
.atcoder-link {
  text-decoration: none;
}
</style>
