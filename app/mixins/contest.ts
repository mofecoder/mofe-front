import { Component, Vue } from 'nuxt-property-decorator'
import { contestStore } from '~/utils/store-accessor'
import { ContestDetail } from '~/types/contest'
import { HttpError } from '~/utils/axios'
@Component
export default class MixinContest extends Vue {
  async fetch() {
    await this.getContest()
  }

  async getContest(): Promise<void> {
    await this.$nextTick()
    this.$nuxt.$loading.start()
    await contestStore
      .getContest(this.$route.params.contestName)
      .then(() => {
        this.$nuxt.$loading.finish()
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

  get contest(): ContestDetail | null {
    return contestStore.contest
  }

  get contestSlug(): string {
    return this.$route.params.contestName
  }
}
