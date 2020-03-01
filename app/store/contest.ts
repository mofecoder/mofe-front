import { $api } from '~/utils/api'
import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { Contest } from '~/types/contest'

interface ContestState {
  contest: Contest | null
}

@Module({
  name: 'contest',
  stateFactory: true,
  namespaced: true
})
export default class ContestModule extends VuexModule implements ContestState {
  contest: Contest | null = null

  @Mutation
  updateContest(contest: Contest) {
    this.contest = contest
  }

  @Action({ commit: 'updateContest' })
  async getContest(slug: string) {
    const contest = await $api.Contests.index(slug)
    return contest
  }
}
