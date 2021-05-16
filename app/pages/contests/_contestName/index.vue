<template>
  <v-card :loading="!contest">
    <template v-if="contest">
      <v-card-title v-text="contest.name" />
      <v-card-subtitle>ペナルティ: {{ penaltyTime }}</v-card-subtitle>
      <v-card-text class="contest-card">
        <template v-if="contestEnded || isWriter" />
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
        <v-btn
          v-if="isAdmin"
          class="mb-4"
          color="purple white--text"
          link
          :to="`/manage/contests/${contestSlug}`"
          dense
          >コンテストの編集画面へ</v-btn
        >
        <div
          class="contest-card__description"
          v-html="$md.render(contest.description)"
        />
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
import { userStore } from '~/utils/store-accessor'
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

  get isAdmin() {
    return userStore.user?.role === 'admin'
  }

  get isWriter() {
    return this.contest?.writtenTasks.length > 0
  }

  async register() {
    if (!userStore.getUser) {
      await this.$router.push({
        path: '/login',
        query: { redirect: this.$route.path }
      })
      return
    }

    await this.$api.Contests.register(this.contest!.slug).then(() =>
      this.$fetch()
    )
  }
}
</script>

<style lang="scss" scoped>
.contest-card {
  @include card-text-reset();

  &__description ::v-deep {
    h1,
    h2 {
      margin-top: 1.5em;
    }
    h3,
    h4 {
      margin-top: 1em;
    }
    h5,
    h6 {
      margin-top: 0.5em;
    }

    table {
      border-collapse: collapse;
    }

    tr,
    td,
    th {
      border: solid 1px #666666;
      padding: 0.3em 1em;
    }
  }
}
</style>
