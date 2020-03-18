<template>
  <v-container fluid>
    <v-layout v-if="contest" justify-center>
      <v-flex xl6 lg8 md10>
        <InformationCard
          :name.sync="contest.name"
          :penalty.sync="contest.penaltyTime"
          :description.sync="contest.description"
          :slug="contest.slug"
          :loading="loading.information"
          edit
          @submit="editInformation"
        />
        <ProblemsCard :tasks="contest.tasks" class="my-4" />
        <TimeCardEdit
          class="my-4"
          :loading="loading.time"
          :start.sync="contest.startAt"
          :end.sync="contest.endAt"
          @submit="editTime"
        />
        <SettingsCard class="my-4" />
      </v-flex>
    </v-layout>
    <v-snackbar v-model="updated" :timeout="4000">
      コンテスト情報を更新しました。
    </v-snackbar>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import dayjs from 'dayjs'
import ProblemsCard from '~/components/contestAdmin/ProblemsCard.vue'
import TimeCardEdit from '~/components/contestAdmin/TimeCardEdit.vue'
import SettingsCard from '~/components/contestAdmin/SettingsCard.vue'
import InformationCard from '~/components/contestAdmin/InformationCard.vue'
import { ContestDetailManage } from '~/types/contest'
@Component({
  components: {
    InformationCard,
    ProblemsCard,
    TimeCardEdit,
    SettingsCard
  }
})
export default class PageContestAdmin extends Vue {
  contest: ContestDetailManage | null = null
  loading = {
    information: false,
    time: false
  }

  updated: boolean = false

  get contestName() {
    return this.$route.params.contestName
  }

  async created() {
    await this.reload()
  }

  async reload() {
    this.contest = await this.$api.Contests.showManage(
      this.$route.params.contestName
    )
  }

  async editInformation() {
    if (!this.contest) return
    this.loading.information = true
    await this.$api.Contests.update(this.contest.slug, {
      name: this.contest.name,
      penaltyTime: this.contest.penaltyTime,
      description: this.contest.description
    }).catch(() => (this.loading.information = false))
    this.updated = true
    await this.reload()
    this.loading.information = false
  }

  async editTime() {
    if (!this.contest) return
    this.loading.time = true
    await this.$api.Contests.update(this.contest.slug, {
      startAt: dayjs(this.contest.startAt).format(),
      endAt: dayjs(this.contest.endAt).format()
    }).catch(() => (this.loading.time = false))
    this.updated = true
    await this.reload()
    this.loading.time = false
  }
}
</script>
