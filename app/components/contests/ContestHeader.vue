<template>
  <div class="header">
    <div>{{ name }}</div>
  </div>
</template>
<script setup lang="ts">
defineProps({
  name: {
    type: String,
    required: true
  }
})
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  width: 100%;
  height: 2.5em;
  background-color: #0b3b0c;
  color: #ffffff;
  align-items: center;
  padding-left: 1em;
  font-size: 1.5em;
  span {
    margin: auto 0;
  }
}
</style>
