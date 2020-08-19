<template>
  <div>
    <template v-if="contest">
      <v-container class="pa-0" fluid>
        <v-card v-if="!errorMessage" :loading="!submits && !errorMessage">
          <v-card-title>すべての提出</v-card-title>
          <v-card-text style="color:inherit">
            <SubmitTable v-if="submits" :submits="submits" />
          </v-card-text>
        </v-card>
        <v-alert v-else type="error" icon="mdi-alert">
          {{ errorMessage }}
        </v-alert>
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
import SubmitTable from '~/components/submits/SubmitTable.vue'
import { Submit } from '~/types/submits'
import { HttpError } from '~/utils/axios'
@Component({
  components: { SubmitTable, ContestHeaderTab, ContestHeader },
  layout: 'contest'
})
export default class PageContest extends mixins(MathJax, MixinContest) {
  head() {
    return {
      title: `すべての提出 - ${this.contest?.name}`,
      titleTemplate: null
    }
  }

  async fetch() {
    await this.getContest()
    this.reload()
  }

  created() {
    const callback = () => {
      this.reload()
    }
    this.timeout = setInterval(callback, 5000)
  }

  beforeDestroy() {
    if (this.timeout) clearInterval(this.timeout)
  }

  submits: Submit[] | null = null
  timeout: NodeJS.Timeout | null = null
  errorMessage: string | null = null

  reload() {
    this.$api.Contests.allSubmits(this.$route.params.contestName)
      .then((res: Submit[]) => {
        this.submits = res
      })
      .catch((err: Error) => {
        if (err instanceof HttpError) {
          this.errorMessage = err.response.data.error
        }
        if (this.timeout) clearInterval(this.timeout)
      })
  }
}
</script>

<style lang="scss" scoped></style>
