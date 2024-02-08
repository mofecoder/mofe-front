import { defineStore } from 'pinia'
import type { MaybeRef } from 'vue'
import dayjs from 'dayjs'
import type { ContestDetail } from '~~/types/contest'
import type { Clarification } from '~~/types/clarification'
import Contests from '~/utils/apis/Contests'

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
    async getContest(slug: MaybeRef<string>) {
      if (slug == null) return
      const _this = this
      await http<ContestDetail>(Contests.getContest.$path([unref(slug)]), {
        onRequest() {
          const s = unref(slug)
          if (s != _this.contest?.slug) {
            // console.log(`clear ${_this.contest?.slug} -> ${s}`)
            _this.contest = null
          }
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
        if (process.client) {
          localStorage.setItem(`${unref(slug)}_clar`, dayjs().toISOString())
        }
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
    }
  }
})
