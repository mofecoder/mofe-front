<script setup lang="ts">
const props = defineProps<{
  markdown?: string | null
}>()

const div = ref<HTMLDivElement>()
const { $render } = useNuxtApp()
function renderKatex() {
  if (!div.value) return
  $render(div.value)
}
onMounted(renderKatex)
watch(() => props.markdown, renderKatex)
</script>

<template>
  <div ref="div" v-html="$md.render(markdown ?? '')" />
</template>

<style scoped lang="scss">
.katex-error {
  color: red;
}
</style>
