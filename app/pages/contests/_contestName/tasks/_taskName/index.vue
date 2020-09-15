<template>
  <div>
    <template v-if="contest">
      <v-alert v-if="errorMessage" type="error">
        {{ errorMessage }}
      </v-alert>
      <v-container v-else class="pa-0" fluid>
        <ViewProblemCard :problem="problem" :contest-slug="contestSlug" />
      </v-container>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import ContestHeaderTab from '~/components/ContestHeaderTab.vue'
import ContestHeader from '~/components/ContestHeader.vue'
import { TaskDetail } from '~/types/task'
import MathJax from '~/mixins/mathjax'
import MixinContest from '~/mixins/contest'
import languages from '~/assets/languages'
import { Language } from '~/types/language'
import { HttpError } from '~/utils/axios'
import ViewProblemCard from '~/components/ViewProblemCard.vue'

@Component({
  components: {
    ViewProblemCard,
    ContestHeader,
    ContestHeaderTab
  },
  layout: 'contest'
})
export default class PageContestTasks extends mixins(MathJax, MixinContest) {
  head() {
    return {
      title: this.problem && `${this.problem.position} - ${this.problem.name}`,
      titleTemplate: null
    }
  }

  problem: TaskDetail | null = null
  language: Language | undefined = languages[0]
  submitted = false
  errorMessage: string | null = null

  async fetch() {
    await this.getContest()
    this.$api.Tasks.show(
      this.$route.params.contestName,
      this.$route.params.taskName
    )
      .then((ret: TaskDetail) => {
        this.problem = ret
        this.$nextTick(() => {
          this.renderMathJax()
        })
      })
      .catch((err: Error) => {
        if (err instanceof HttpError) {
          this.errorMessage = err.response.data.error
        }
      })
  }
}
</script>
