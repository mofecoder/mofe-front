/*import { ContestDetail } from '~/types/contest'
import { HttpError } from '~/composables/useApi'
import { Clarification } from '~/types/clarification'
export default class MixinContest extends Vue {
  clarInterval: number = -1

  async fetch() {
    await this.getContest()
  }

  beforeDestroy() {
    window.clearInterval(this.clarInterval)
  }

  async getContest(): Promise<void> {
    await this.$nextTick()
    this.$nuxt.$loading.start()
    await contestStore
      .getContest(this.$route.params.contestName)
      .then(async () => {
        this.clarInterval = window.setInterval(
          this.getClarifications,
          60 * 1000
        )
        await this.getClarifications()
      })
      .catch((error: HttpError) => {
        ;(this.$nuxt.$loading.fail || this.$nuxt.$loading.finish)()
        this.$nuxt.error({
          statusCode: error.response.status,
          message:
            error.response.status === 404
              ? '指定されたコンテストが見つかりません'
              : error.response.data.error
        })
        throw error
      })
  }

  async getClarifications(): Promise<void> {
    await this.$nextTick()
    await contestStore.getClarifications(this.$route.params.contestName)
  }

  get contest(): ContestDetail | null {
    return contestStore.contest
  }

  get clarifications(): Clarification[] | null {
    return contestStore.clarifications
  }

  get contestSlug(): string {
    return this.$route.params.contestName
  }
}*/
