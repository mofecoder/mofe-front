<template>
  <v-data-table :headers="headers" :items="items" locale="ja">
    <template #top>
      <v-toolbar flat color="white">
        <v-toolbar-title>コンテスト一覧</v-toolbar-title>
        <v-spacer />
        <v-btn color="primary" class="mb-2" @click="newContest"
          >コンテストを作成</v-btn
        >
      </v-toolbar>
    </template>
    <template #item.edit="{ item }">
      <v-icon size="small" @click="view(item)">mdi-eye</v-icon>
      <v-icon size="small" @click="edit(item)">mdi-pencil</v-icon>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import dayjs from 'dayjs'
import { Contest } from '~/types/contest'
import 'dayjs/locale/ja'

type ItemType = { name: string; slug: string; startAt: string; endAt: string }

@Component({
  middleware: 'authenticated',
  head: { title: 'コンテストの管理' }
})
export default class PageManageContestIndex extends Vue {
  headers = [
    { text: 'コンテスト名', value: 'name' },
    { text: '開始日時', value: 'startAt' },
    { text: '終了日時', value: 'endAt' },
    { text: '', value: 'edit', sortable: false }
  ]

  contests: Contest[] = []

  get items(): ItemType[] {
    dayjs.locale('ja')
    return this.contests.map((contest: Contest) => ({
      name: contest.name,
      slug: contest.slug,
      startAt: dayjs(contest.startAt).format('YYYY/MM/DD HH:mm'),
      endAt: dayjs(contest.endAt).format('YYYY/MM/DD HH:mm')
    }))
  }

  async created() {
    this.contests = await this.$api.Contests.holding()
  }

  newContest() {
    this.$router.push('/manage/contests/new')
  }

  view(item: ItemType) {
    this.$router.push(`/contests/${item.slug}`)
  }

  edit(item: ItemType) {
    this.$router.push(`/manage/contests/${item.slug}`)
  }
}
</script>

<style scoped lang="scss"></style>
