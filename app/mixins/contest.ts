import { Component, Vue } from 'nuxt-property-decorator'
import { contestStore } from '../utils/store-accessor'
import { Contest } from '../types/contest'
@Component
export default class MixinContest extends Vue {
  async getContest(): Promise<void> {
    await contestStore.getContest(this.$route.params.contestName)
  }

  get contest(): Contest | null {
    return contestStore.contest
  }

  get contestSlug(): string {
    return this.$route.params.contestName
  }
}
