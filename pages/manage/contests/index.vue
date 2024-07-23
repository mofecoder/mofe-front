<script setup lang="ts">
import ManageContests from '~/utils/apis/ManageContests'

definePageMeta({
  middleware: 'admin'
})

useHead({
  title: 'コンテストの管理'
})

const { data: contests } = await useApi(ManageContests.getContests, [])
const dayjs = useDayjs()

const headers = [
  { title: 'コンテスト名', key: 'name' },
  { title: '開始日時', key: 'startAt' },
  { title: '終了日時', key: 'endAt' },
  { title: '', key: 'edit', sortable: false }
]
const items = computed(
  () =>
    contests.value?.map((contest) => ({
      name: contest.name,
      slug: contest.slug,
      startAt: dayjs(contest.startAt).format('YYYY/MM/DD HH:mm'),
      endAt: dayjs(contest.endAt).format('YYYY/MM/DD HH:mm')
    })) || []
)
</script>

<template>
  <v-data-table :headers="headers" :items="items" locale="ja">
    <template #top>
      <v-toolbar flat color="transparent">
        <v-toolbar-title>コンテスト一覧</v-toolbar-title>
        <v-spacer />
        <v-btn
          color="primary"
          class="mb-2"
          to="/manage/contests/new"
          variant="tonal"
          prepend-icon="mdi-plus"
          >コンテストを作成</v-btn
        >
      </v-toolbar>
    </template>
    <template #item.edit="{ item }">
      <v-btn
        size="small"
        density="compact"
        :to="`/contests/${item.slug}`"
        icon
        variant="text"
      >
        <v-icon icon="mdi-eye" />
      </v-btn>
      <v-btn
        size="small"
        density="compact"
        :to="`/manage/contests/${item.slug}`"
        icon
        variant="text"
      >
        <v-icon icon="mdi-pencil" />
      </v-btn>
    </template>
  </v-data-table>
</template>

<style scoped lang="scss"></style>
