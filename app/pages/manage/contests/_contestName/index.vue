<template>
  <v-container fluid>
    <v-layout v-if="contest" justify-center>
      <v-flex xl6 lg8 md10>
        <v-btn class="mb-3" nuxt to=".." append text color="purple"
          >コンテスト一覧に戻る</v-btn
        >

        <InformationCard
          :name.sync="contest.name"
          :penalty.sync="contest.penaltyTime"
          :description.sync="contest.description"
          :editorial-url.sync="contest.editorial"
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
import { Problem } from '~/types/contestAdmin'
@Component({
  components: {
    AddProblemCard,
    InformationCard,
    ProblemsCard,
    TimeCardEdit,
    SettingsCard
  },
  middleware: 'authenticated'
})
export default class PageContestAdmin extends Vue {
  @Ref('addProblemCard')
  addProblemCard!: AddProblemCard

  contest: ContestDetailManage | null = null
  unsetProblems: Problem[] | null = null
  loading = {
    information: false,
    time: false,
    tasks: false
  }

  updated: boolean = false
  modal: boolean = false

  head() {
    return {
      title: `[${this.contestName}] コンテストの編集`
    }
  }

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
    this.unsetProblems = await this.$api.Problems.unsetProblems()
  }

  async editInformation() {
    if (!this.contest) return
    this.loading.information = true
    await this.$api.Contests.update(this.contest.slug, {
      name: this.contest.name,
      penaltyTime: this.contest.penaltyTime,
      description: this.contest.description,
      editorialUrl: this.contest.editorial || undefined
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

  async addProblem(problem: Problem) {
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
