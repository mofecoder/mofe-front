<script lang="ts" setup>
import Contests from '~/utils/apis/Contests'

definePageMeta({
  layout: 'contest'
})

const { contest, contestName } = useContest()
const dayjs = useDayjs()

useHead(() => ({
  title: `順位表 - ${contest.value?.name}`,
  titleTemplate: null
}))

const closedMode = ref(false)
const teamMode = ref(false)
const sortColumn = ref<string | null>(null)
const sortOrder = ref<'asc' | 'desc' | null>(null)
const args = computed(
  () =>
    [contestName.value, closedMode.value, teamMode.value] as [
      string,
      boolean,
      boolean
    ]
)

const query = computed(() => ({
  sort_column: sortColumn.value,
  order: sortOrder.value
}))
const {
  data: standingData,
  status,
  refresh
} = await useApi(Contests.getStandings, args, {
  query,
  lazy: true
})
const problems = computed(() => standingData.value?.problems || [])
const standings = computed(() => standingData.value?.standings)

const showSubmissions = computed(() =>
  contest.value
    ? dayjs(contest.value.endAt).isBefore(dayjs()) ||
      contest.value.isWriterOrTester
    : false
)
const submissionsPath = computed(() =>
  showSubmissions.value && contest.value
    ? `/contests/${contest.value.slug}/submissions`
    : null
)

const { pause, resume, isActive } = useIntervalFn(
  async () => {
    await refresh()
  },
  5000,
  { immediate: false }
)
</script>

<template>
  <div>
    <v-no-ssr v-if="contest">
      <v-sheet v-if="!standings">
        <h2 class="my-4">順位表</h2>
        <p>Loading...</p>
      </v-sheet>
      <template v-else>
        <ContestsStandingsTable
          v-model:closed-mode="closedMode"
          v-model:team-mode="teamMode"
          v-model:sort-column="sortColumn"
          v-model:sort-order="sortOrder"
          :loading="status === 'pending'"
          :problems="problems"
          :standings="standings"
          :mode="contest.standingsMode"
          :team="contest.allowTeamRegistration"
          :exclude-open="
            contest.allowOpenRegistration && contest.registrationRestriction
          "
          :submissions-path="submissionsPath"
          @reload="refresh"
        />
      </template>
      <div v-if="contest.isAdmin" class="d-flex mt-4">
        <v-btn
          variant="outlined"
          :color="isActive ? 'secondary' : 'grey-darken-2'"
          @click="isActive ? pause() : resume()"
        >
          自動更新：{{ isActive ? '有効' : '無効' }}
        </v-btn>
      </div>
    </v-no-ssr>
  </div>
</template>

<style scoped></style>
