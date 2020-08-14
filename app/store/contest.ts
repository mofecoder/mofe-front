import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { $api } from '~/utils/api'
import { ContestDetail } from '~/types/contest'

interface ContestState {
  contest: ContestDetail | null
}

@Module({
  name: 'contest',
  stateFactory: true,
  namespaced: true
})
export default class ContestModule extends VuexModule implements ContestState {
  contest: ContestDetail | null = null

  @Mutation
  updateContest(contest: ContestDetail) {
    this.contest = contest
  }

  @Action({ commit: 'updateContest', rawError: true })
  async getContest(slug: string) {
    const contest = await $api.Contests.show(slug)
    return contest
  }
}
