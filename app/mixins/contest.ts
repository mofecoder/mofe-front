import { Component, Vue } from 'nuxt-property-decorator'
import { contestStore } from '~/utils/store-accessor'
import { ContestDetail } from '~/types/contest'
@Component
export default class MixinContest extends Vue {
  async getContest(): Promise<void> {
    await this.$nextTick()
    this.$nuxt.$loading.start()
    await contestStore
      .getContest(this.$route.params.contestName)
      .then(() => {
        this.$nuxt.$loading.finish()
      })
      .catch(() => {
        ;(this.$nuxt.$loading.fail || this.$nuxt.$loading.finish)()
      })
  }

  get contest(): ContestDetail | null {
    return contestStore.contest
  }

  get contestSlug(): string {
    return this.$route.params.contestName
  }
}
