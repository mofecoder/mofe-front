import { defineStore } from 'pinia'
import type { MaybeRef } from 'vue'
import type { ContestDetail } from '~/types/contest'
import type { Clarification } from '~/types/clarification'
import { contestsApi } from '~/utils/apis'

interface ContestState {
  slug: string | null
  contest: ContestDetail | null
  clarifications: Clarification[] | null
  interval: number | null
}

export const useContestStore = defineStore('contest', {
  state: (): ContestState => ({
    slug: null,
    contest: null,
    clarifications: null,
    interval: null
  }),
  actions: {
    async getContest(slug: MaybeRef<string>) {
      if (slug == null) return
      const updated = import.meta.client && this.slug !== toValue(slug)
      if (import.meta.client) this.slug = toValue(slug)
      const contestsRepo = contestsApi()
      if (updated) {
        this.contest = null
        if (this.interval != null) {
          window.clearInterval(this.interval)
        }
        this.interval = window.setInterval(async () => {
          await this.getClarifications(slug)
        }, 30000)
      }
      const res = await contestsRepo.get(toValue(slug))
      if (res) {
        this.updateContest(res)
      }
    },

    async getClarifications(slug: MaybeRef<string>) {
      const contestsRepo = contestsApi()
      const res = await contestsRepo.clarifications(toValue(slug))
      if (res) {
        this.updateClarifications(res)
      }
    },
    updateContest(contest: ContestDetail) {
      this.contest = contest
    },
    updateClarifications(clarifications: Clarification[]) {
      this.clarifications = clarifications
    },
    leave() {
      if (this.interval && import.meta.client) {
        window.clearInterval(this.interval)
        this.interval = null
      }
    }
  }
})
