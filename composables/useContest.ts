import { storeToRefs } from 'pinia'
import { useContestStore } from '~/store/contest'
import dayjs from 'dayjs'

export function useContest() {
  const route = useRoute()
  const contestName = computed(() => {
    const p = route.params.contestName
    if (Array.isArray(p)) return p[0]
    return p
  })
  const contestStore = useContestStore()
  const { contest, clarifications } = storeToRefs(contestStore)

  const updateContest = async (loadClarifications: boolean = true) => {
    if (!contestName.value) return
    return contestStore.getContest(contestName).then(async () => {
      if (loadClarifications) await updateClarifications()
    })
  }

  const updateClarifications = async () => {
    if (!contestName.value) return
    return contestStore.getClarifications(contestName)
  }

  watch(contestName, async (name) => {
    if (name) {
      await updateContest()
    }
  })

  return {
    contestName,
    contest,
    clarifications,
    updateContest,
    updateClarifications
  }
}
