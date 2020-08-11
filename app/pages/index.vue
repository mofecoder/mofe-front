<template>
  <v-card>
    <v-card-title>コンテストの一覧</v-card-title>
    <v-card-text>
      <v-simple-table v-if="contests">
        <table>
          <tr>
            <th>開始日時</th>
            <th>コンテスト名</th>
          </tr>
          <tr v-for="contest in contests" :key="contest.slug">
            <td v-text="formatDate(contest.startAt)" />
            <td>
              <nuxt-link
                :to="`contests/${contest.slug}`"
                v-text="contest.name"
              />
            </td>
          </tr>
        </table>
      </v-simple-table>
      <nuxt-link v-if="loggedIn" to="manage">管理ページへ</nuxt-link>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import dayjs from 'dayjs'
import { Contest } from '~/types/contest'
import { userStore } from '~/utils/store-accessor'

@Component
export default class PageMainPage extends Vue {
  contests: Contest[] | null = null
  async created() {
    this.contests = await this.$api.Contests.index()
  }

  get loggedIn() {
    return userStore.getUser && userStore.getUser.role !== 'member'
  }

  formatDate = (date: string) => dayjs(date).format('MM/DD HH:mm')
}
</script>

<style scoped lang="scss"></style>
