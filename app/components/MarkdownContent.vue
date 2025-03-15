<script setup lang="ts">
const props = defineProps<{
  markdown: string
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
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div ref="div" v-html="$md.render(markdown)" />
</template>

<style scoped lang="scss">
.katex-error {
  color: red;
}
</style>
