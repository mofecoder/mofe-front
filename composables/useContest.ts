import { storeToRefs } from 'pinia'
import { useContestStore } from '~/store/contest'

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
    const res = contestStore.getContest(contestName)
    if (loadClarifications) await updateClarifications()
    return res
  }

  const updateClarifications = async () => {
    if (!contestName.value) return
    return contestStore.getClarifications(contestName)
  }

  watch(contestName, async () => await updateContest(), { immediate: true })

  return {
    contestName,
    contest,
    clarifications,
    updateContest,
    updateClarifications
  }
}
