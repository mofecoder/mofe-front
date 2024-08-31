<script setup lang="ts">
const props = defineProps<{
  condition: boolean | (() => boolean) | (() => Promise<boolean>)
}>()
defineSlots<{
  fallback(): any
}>()

const cond = await(async () => {
  if (typeof props.condition === 'boolean') {
    return props.condition
  }
  const res = props.condition()
  if (typeof res === 'boolean') {
    return res
  }
  return await res
})()
</script>

<template>
  <ClientOnly v-if="cond">
    <slot />
    <template #fallback>
      <slot name="fallback" />
    </template>
  </ClientOnly>
  <template v-else>
    <slot />
  </template>
</template>

<style scoped lang="scss"></style>
