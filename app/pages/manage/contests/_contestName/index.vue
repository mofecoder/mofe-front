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
        <ProblemsCard
          :tasks="contest.tasks"
          :loading="loading.tasks"
          class="my-4"
          @add="openModal"
          @remove="remove"
        />
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
    <v-dialog v-model="modal">
      <AddProblemCard
        ref="addProblemCard"
        :items="unsetProblems || []"
        @close="modal = false"
        @add="addProblem"
      />
    </v-dialog>
    <v-snackbar v-model="updated" :timeout="4000">
      コンテスト情報を更新しました。
    </v-snackbar>
  </v-container>
</template>

<script lang="ts">
import { Component, Ref, Vue } from 'nuxt-property-decorator'
import dayjs from 'dayjs'
import ProblemsCard from '~/components/contestAdmin/ProblemsCard.vue'
import TimeCardEdit from '~/components/contestAdmin/TimeCardEdit.vue'
import SettingsCard from '~/components/contestAdmin/SettingsCard.vue'
import InformationCard from '~/components/contestAdmin/InformationCard.vue'
import { ContestDetailManage } from '~/types/contest'
import AddProblemCard from '~/components/contestAdmin/AddProblemCard.vue'
import { UnsetProblem } from '~/types/contestAdmin'
@Component({
  components: {
    AddProblemCard,
    InformationCard,
    ProblemsCard,
    TimeCardEdit,
    SettingsCard
  }
})
export default class PageContestAdmin extends Vue {
  @Ref('addProblemCard')
  addProblemCard!: AddProblemCard

  contest: ContestDetailManage | null = null
  unsetProblems: UnsetProblem[] | null = null
  loading = {
    information: false,
    time: false,
    tasks: false
  }

  updated: boolean = false
  modal: boolean = false

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
    this.unsetProblems = await this.$api.Problems.index()
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

  async addProblem(problem: UnsetProblem) {
    this.modal = false
    this.loading.tasks = true
    let pos = ''
    const used = new Set(this.contest!.tasks.map((x) => x.position))
    for (let c = 'A'; c !== 'Z'; c = String.fromCharCode(c.charCodeAt(0) + 1)) {
      if (!used.has(c)) {
        pos = c
        break
      }
    }
    await this.$api.Contests.addTask(
      this.contestName,
      problem.id,
      `${this.contestName}_${pos.toLowerCase()}`,
      pos
    )
    await this.reload()
    this.loading.tasks = false
  }

  async remove(slug: string) {
    this.loading.tasks = true
    await this.$api.Contests.removeTask(this.contestName, slug)
    await this.reload()
    this.loading.tasks = false
  }

  async openModal() {
    await this.reload()
    this.modal = true
  }
}
</script>
