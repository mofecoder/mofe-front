<template>
  <v-card flat></v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class PagePageWriterTaskView extends Vue {
  validate({ params }: { params: { [key: string]: string } }): boolean {
    return /^[1-9]\d*$/.test(params.problemId)
  }

  get problemId() {
    return Number(this.$route.params.problemId)
  }
}
</script>

<style scoped lang="scss"></style>
