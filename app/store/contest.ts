import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { $api } from '~/utils/api'
import { ContestDetail } from '~/types/contest'
import { Clarification } from '~/types/clarification'

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
  clarifications: Clarification[] | null = null

  @Mutation
  updateContest(contest: ContestDetail) {
    this.contest = contest
  }

  @Mutation
  updateClarifications(clarifications: Clarification[]) {
    this.clarifications = clarifications
  }

  @Action({ commit: 'updateContest', rawError: true })
  async getContest(slug: string) {
    const contest = await $api.Contests.show(slug)
    return contest
  }

  @Action({ commit: 'updateClarifications', rawError: true })
  async getClarifications(slug: string) {
    const clarifications = await $api.Contests.clarifications(slug)
    return clarifications
  }
}
