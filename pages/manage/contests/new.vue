<script setup lang="ts">
import type { Dayjs } from 'dayjs'
import type { ContestDetail } from '~/types/contest'
import TimeRangePickerCard from '~/components/manage/contests/TimeRangePickerCard.vue'
import ManageContests from '~/utils/apis/ManageContests'
import EditContestCard from '~/components/manage/contests/EditContestCard.vue'

const dayjs = useDayjs()

definePageMeta({
  middleware: 'admin'
})

useHead({
  title: 'コンテストの作成'
})

const params = reactive({
  name: '',
  slug: '',
  description: '',
  penalty: '0',
  officialMode: false,
  kind: 'normal' as ContestDetail['kind'],
  dateRange: [dayjs(), dayjs().add(1, 'h')] as [Dayjs, Dayjs],
  standingsMode: 'atcoder' as ContestDetail['standingsMode']
})

const disabled = computed(() => {
  return !(
    params.dateRange[0].isBefore(params.dateRange[1]) &&
    params.name &&
    /\S+/.test(params.slug) &&
    params.slug !== 'new'
  )
})

const router = useRouter()
const submit = async () => {
  await useApi(
    ManageContests.createContest,
    [],
    {},
    {
      name: params.name,
      slug: params.slug,
      kind: params.kind,
      startAt: params.dateRange[0].format(),
      endAt: params.dateRange[1].format(),
      description: params.description,
      penaltyTime: parseInt(params.penalty) * 60,
      standingsMode: params.standingsMode
    }
  ).then(({ error }) => {
    if (error.value) alert('コンテストの作成に失敗しました')
    else router.push(`/manage/contests/${params.slug}`)
  })
}
</script>

<template>
  <v-container fluid>
    <h1 class="text-h4 ma-2">コンテストの作成</h1>
    <EditContestCard
      v-model:name="params.name"
      v-model:slug="params.slug"
      v-model:description="params.description"
      v-model:penalty="params.penalty"
      v-model:kind="params.kind"
      v-model:official-mode="params.officialMode"
      v-model:standings-mode="params.standingsMode"
      class="my-2"
    />
    <TimeRangePickerCard v-model="params.dateRange" class="my-2" />
    <v-btn
      :disabled="disabled"
      block
      color="primary"
      size="large"
      @click="submit"
    >
      コンテストを作成する
    </v-btn>
  </v-container>
</template>

<style scoped lang="scss"></style>
