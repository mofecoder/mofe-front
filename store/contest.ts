import { defineStore } from 'pinia'
import type { MaybeRef } from 'vue'
import type { ContestDetail } from '~~/types/contest'
import type { Clarification } from '~~/types/clarification'
import Contests from '~/utils/apis/Contests'

interface ContestState {
  slug: string | null
  contest: ContestDetail | null
  clarifications: Clarification[] | null
  interval: number | null
}

export const useContestStore = defineStore({
  id: 'contest',
  state: (): ContestState => ({
    slug: null,
    contest: null,
    clarifications: null,
    interval: null
  }),
  actions: {
    async getContest(slug: MaybeRef<string>) {
      if (slug == null) return
      const updated = process.client && this.slug !== toValue(slug)
      if (process.client) this.slug = toValue(slug)
      const _this = this
      await http<ContestDetail>(Contests.getContest.$path([unref(slug)]), {
        onRequest() {
          if (!updated || !process.client) return
          _this.contest = null
          if (_this.interval != null) {
            window.clearInterval(_this.interval)
          }
          _this.interval = window.setInterval(async () => {
            await _this.getClarifications(slug)
          }, 30000)
        }
      }).then((res) => {
        if (res) {
          this.updateContest(res)
        }
      })
    },

    async getClarifications(slug: MaybeRef<string>) {
      await http<Clarification[]>(
        Contests.getClarifications.$path([unref(slug)])
      ).then((res) => {
        if (res) {
          this.updateClarifications(res)
        }
      })
    },
    updateContest(contest: ContestDetail) {
      this.contest = contest
    },
    updateClarifications(clarifications: Clarification[]) {
      this.clarifications = clarifications
    },
    leave() {
      if (this.interval && process.client) {
        window.clearInterval(this.interval)
        this.interval = null
      }
    }
  }
})
