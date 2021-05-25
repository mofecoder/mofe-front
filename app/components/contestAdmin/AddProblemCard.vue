<template>
  <v-card :loading="loading">
    <v-card-title>問題を追加</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="6" sm="5" md="3" lg="2">
          <v-text-field
            v-model.number="problemId"
            type="number"
            dense
            min="1"
            label="問題 ID"
            hide-details
            solo
          />
        </v-col>
        <v-col cols="5" sm="4" md="2">
          <v-btn
            color="primary"
            block
            :disabled="!problemId"
            :loading="status === 'loading'"
            @click="showProblem"
            >表示</v-btn
          >
        </v-col>
        <v-col cols="11" sm="9" md="7" lg="4">
          <v-btn color="cyan lighten-1" block @click="modal = true"
            >問題一覧から追加</v-btn
          >
        </v-col>
      </v-row>
      <v-row justify="end">
        <v-col cols="12">
          <p v-if="problemMessage" class="red--text" v-text="problemMessage" />
          <ProblemsCardTable
            v-else-if="problem"
            problem-mode
            :tasks="[problem]"
          />
        </v-col>
      </v-row>
      <v-row v-if="problem && !problemMessage">
        <v-col cols="4" sm="3" lg="2">
          <v-select
            v-model="position"
            outlined
            label="位置"
            hide-details
            :items="positions"
          />
        </v-col>
        <v-col cols="8" sm="6" lg="4">
          <v-btn
            color="green darken-2 white--text"
            :disabled="!position"
            @click="add"
            >この問題を追加する</v-btn
          >
          <v-checkbox
            v-model="showAll"
            class="mt-1"
            hide-details
            dense
            label="28問以降も表示する"
          />
        </v-col>
      </v-row>
    </v-card-text>
    <v-dialog v-model="modal">
      <ProblemListCard
        ref="problemListCard"
        :items="unsetProblems || []"
        @close="modal = false"
        @add="addProblem"
      />
    </v-dialog>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { ProblemDetail } from '~/types/problems'
import Positions from '~/constants/positions'
import ProblemsCardTable from '~/components/contestAdmin/ProblemsCardTable.vue'
import ProblemListCard from '~/components/contestAdmin/ProblemListCard.vue'
import { Problem } from '~/types/contestAdmin'

@Component({
  components: { ProblemListCard, ProblemsCardTable }
})
export default class AddProblemCard extends Vue {
  @Prop({ required: true })
  usedPositions!: Set<string>

  @Prop()
  loading?: boolean

  @Prop({ required: true })
  unsetProblems!: Problem[]

  problemId: number | null = null
  status = ''
  position = ''
  showAll = false
  problem: ProblemDetail | null = null
  modal = false

  get problemMessage() {
    if (!this.status) return null
    if (this.status === 'error') return '該当する問題はありません'
    if (!this.problem) return null
    const { name, contest, writerUser } = this.problem
    const problemName = `${name} (${writerUser})`
    if (contest) {
      return `問題「${problemName}」は ${contest?.name} に使われています`
    }
    return null
  }

  get positions() {
    return Positions.slice(0, this.showAll ? Positions.length : 26).filter(
      (p) => !this.usedPositions.has(p)
    )
  }

  async showProblem() {
    if (!this.problemId) return
    this.status = 'loading'
    this.problem = await this.$api.Problems.show(this.problemId)
      .then((res) => {
        this.status = 'ok'
        this.position = this.positions[0] || ''
        return res
      })
      .catch(() => {
        this.status = 'error'
        return null
      })
  }

  addProblem({ id }: Problem) {
    this.status = 'loading'
    this.problemId = id
    this.modal = false
    this.showProblem()
  }

  add() {
    this.$emit('add', this.problem!.id, this.position)
    this.problemId = null
    this.problem = null
    this.status = ''
  }
}
</script>

<style scoped lang="scss">
.cursor-pointer {
  cursor: pointer;
}
.problem-link {
  text-decoration: none;
}
</style>
