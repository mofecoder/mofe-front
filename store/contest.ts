import { defineStore } from 'pinia'
import { $api } from '~~/utils/api'
import { ContestDetail } from '~~/types/contest'
import { Clarification } from '~~/types/clarification'

interface ContestState {
  contest: ContestDetail | null
  clarifications: Clarification[] | null
}

export const useContestStore = defineStore({
  id: 'contest',
  state: (): ContestState => ({
    contest: null,
    clarifications: null
  }),
  actions: {
    async getContest(slug: string) {
      const contest = await $api.Contests.show(slug)
      this.updateContest(contest)
    },

    async getClarifications(slug: string) {
      const clarifications = await $api.Contests.clarifications(slug)
      this.updateClarifications(clarifications)
    },
    updateContest(contest: ContestDetail) {
      this.contest = contest
    },
    updateClarifications(clarifications: Clarification[]) {
      this.clarifications = clarifications
    }
  }
})
