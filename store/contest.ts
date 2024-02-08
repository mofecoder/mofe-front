import { defineStore } from 'pinia'
import type { ContestDetail } from '~~/types/contest'
import type { Clarification } from '~~/types/clarification'
import Contests from '~/utils/apis/Contests'
import type { MaybeRef } from 'vue'
import dayjs from 'dayjs'

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
      await useApi(Contests.getContest, () => [unref(slug)] as [string], {
        onRequest() {
          const s = unref(slug)
          if (s != _this.contest?.slug) {
            // console.log(`clear ${_this.contest?.slug} -> ${s}`)
            _this.contest = null
          }
        }
      }).then((res) => {
        if (res.data.value) {
          this.updateContest(res.data.value)
        }
      })
    },

    async getClarifications(slug: MaybeRef<string>) {
      await useApi(
        Contests.getClarifications,
        () => [unref(slug)] as [string]
      ).then((res) => {
        if (process.client) {
          localStorage.setItem(`${unref(slug)}_clar`, dayjs().toISOString())
        }
        if (res.data.value) {
          this.updateClarifications(res.data.value)
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
