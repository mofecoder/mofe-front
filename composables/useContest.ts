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
    if (loadClarifications) await updateClarifications(false)
    return res
  }

  const dayjs = useDayjs()
  const updateClarifications = async (read = false) => {
    if (!contestName.value) return
    if (read && process.client) {
      localStorage.setItem(`${contestName.value}_clar`, dayjs().toISOString())
    }
    return contestStore.getClarifications(contestName)
  }

  watch(contestName, async () => await updateContest(), { immediate: true })

  onBeforeRouteLeave((to) => {
    if (!to.path.startsWith(`/contests/${contestName.value}`)) {
      contestStore.leave()
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
