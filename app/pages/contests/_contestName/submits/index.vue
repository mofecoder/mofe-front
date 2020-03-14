<template>
  <div>
    <template v-if="contest">
      <v-container class="pa-0" fluid>
        <v-card>
          <v-card-title></v-card-title>
          <v-card-text style="color:inherit">自分の提出</v-card-text>
        </v-card>
      </v-container>
    </template>
  </div>
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
  async created() {
    await this.getContest()
  }

  beforeDestroy() {
    if (this.timeout) clearInterval(this.timeout)
  }

  submits: Submit[] | null = null
  timeout: NodeJS.Timeout | null = null

  reload() {
    this.$api.Contests.mySubmits(this.$route.params.contestName)
      .then((res: Submit[]) => {
        this.submits = res
      })
      .catch((err: Error) => {
        if (err.message === 'Not logged in.') this.$router.replace('/login')
      })
  }
}
</script>

<style scoped></style>
