<template>
  <v-card :loading="!contest">
    <template v-if="contest">
      <v-card-title v-text="contest.name" />
      <v-card-subtitle>ペナルティ: {{ penaltyTime }}</v-card-subtitle>
      <v-card-text v-html="$md.render(contest.description)" />
    </template>
  </v-card>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import ContestHeader from '~/components/ContestHeader.vue'
import ContestHeaderTab from '~/components/ContestHeaderTab.vue'
import MathJax from '~/mixins/mathjax'
import MixinContest from '~/mixins/contest'
@Component({
  components: { ContestHeaderTab, ContestHeader },
  layout: 'contest'
})
export default class PageContest extends mixins(MathJax, MixinContest) {
  get penaltyTime(): string {
    const pena = this.contest!.penaltyTime
    if (!pena) return 'なし'
    return pena % 60
      ? `${Math.ceil(pena / 60)} 分 ${pena % 60} 秒`
      : `${pena / 60} 分`
  }
}
</script>

<style scoped></style>
