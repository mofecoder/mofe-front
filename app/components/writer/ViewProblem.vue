<template>
  <div class="ma-4">
    <ViewProblemCard :problem="problem" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import ViewProblemCard from '~/components/ViewProblemCard.vue'
import { ProblemDetail } from '~/types/problems'
@Component({
  components: { ViewProblemCard }
})
export default class ViewProblem extends Vue {
  @Prop({ required: true })
  problemId!: number

  problem: ProblemDetail | null = null

  async fetch() {
    this.problem = await this.$api.Problems.show(this.problemId)
  }
}
</script>

<style scoped lang="scss"></style>
