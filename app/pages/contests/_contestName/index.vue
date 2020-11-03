<template>
  <v-card :loading="!contest">
    <template v-if="contest">
      <v-card-title v-text="contest.name" />
      <v-card-subtitle>ペナルティ: {{ penaltyTime }}</v-card-subtitle>
      <v-card-text>
        <template v-if="contestEnded" />
        <v-btn
          v-else-if="contest.registered"
          color="primary"
          disabled
          class="mb-4"
          >参加登録済み</v-btn
        >
        <v-btn v-else color="primary" class="mb-4" @click="register"
          >参加登録</v-btn
        >
        <div v-html="$md.render(contest.description)" />
      </v-card-text>
    </template>
  </v-card>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import dayjs from 'dayjs'
import ContestHeader from '~/components/ContestHeader.vue'
import ContestHeaderTab from '~/components/ContestHeaderTab.vue'
import MathJax from '~/mixins/mathjax'
import MixinContest from '~/mixins/contest'
@Component({
  components: { ContestHeaderTab, ContestHeader },
  layout: 'contest'
})
export default class PageContest extends mixins(MathJax, MixinContest) {
  head() {
    return {
      title: this.contest?.name
    }
  }

  get penaltyTime(): string {
    const pena = this.contest!.penaltyTime
    if (!pena) return 'なし'
    return pena % 60
      ? `${Math.ceil(pena / 60)} 分 ${pena % 60} 秒`
      : `${pena / 60} 分`
  }

  get contestEnded() {
    return dayjs(this.contest?.endAt).isBefore(dayjs())
  }

  async register() {
    await this.$api.Contests.register(this.contest!.slug).then(() =>
      this.$fetch()
    )
  }
}
</script>

<style scoped></style>
