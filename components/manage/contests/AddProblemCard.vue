<script setup lang="ts">
import { Problem } from '~/types/contestAdmin'
import { ProblemDetail } from '~/types/problems'
import ManageProblems from '~/utils/apis/ManageProblems'

import { Positions } from '~/constants/contests'
import { ProblemType } from '~/components/manage/contests/ProblemCardTable.vue'

const props = defineProps<{
  usedPositions: Set<string>
  loading?: boolean
  unsetProblems: Problem[]
}>()

const emits = defineEmits<{
  add: [problemId: number, position: string]
}>()

const problemId = ref<number | null>(null)
const status = ref('')
const position = ref('')
const showAll = ref(false)
const problem = ref<ProblemDetail | null>(null)
const modal = ref(false)

const problemMessage = computed(() => {
  if (!status.value) return null
  if (status.value === 'error') return '該当する問題はありません'
  if (!problem.value) return null
  const { name, contest, writerUser } = problem.value
  const problemName = `${name} (${writerUser})`
  if (contest) {
    return `問題「${problemName}」は ${contest?.name} に使われています`
  }
  return null
})

const positions = computed(() => {
  return Positions.slice(0, showAll.value ? Positions.length : 26).filter(
    (p) => !props.usedPositions.has(p)
  )
})

const showProblem = async () => {
  if (!problemId.value) return
  status.value = 'loading'
  problem.value = await useApi(ManageProblems.getProblem, [problemId.value])
    .then(({ data, error }) => {
      if (error.value) {
        console.log(error.value)
        status.value = 'error'
        return null
      }
      status.value = 'ok'
      position.value = positions.value[0] || ''
      return data.value
    })
    .catch(() => {
      status.value = 'error'
      return null
    })
}

const addProblem = async ({ id }: Problem) => {
  problemId.value = id
  modal.value = false
  await showProblem()
}

const add = () => {
  emits('add', problem.value!.id, position.value)
  problemId.value = null
  problem.value = null
  status.value = ''
}

const tableTasks = computed(() => [problem.value!] as ProblemType[])
</script>

<template>
  <v-card :loading="loading">
    <v-card-title>問題を追加</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="6" sm="5" md="3" lg="2">
          <v-text-field
            v-model.number="problemId"
            type="number"
            density="compact"
            min="1"
            label="問題 ID"
            hide-details
            variant="solo"
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
          <v-btn color="cyan-lighten-1" block @click="modal = true"
            >問題一覧から追加</v-btn
          >
        </v-col>
      </v-row>
      <v-row justify="end">
        <v-col cols="12">
          <p v-if="problemMessage" class="text-red" v-text="problemMessage" />
          <ManageContestsProblemCardTable
            v-else-if="problem"
            problem-mode
            :tasks="tableTasks"
          />
        </v-col>
      </v-row>
      <v-row v-if="problem && !problemMessage">
        <v-col cols="4" sm="3" lg="2">
          <v-select
            v-model="position"
            variant="outlined"
            density="compact"
            label="位置"
            :items="positions"
          />
        </v-col>
        <v-col cols="8" sm="6" lg="4">
          <v-btn color="green-darken-2" :disabled="!position" @click="add"
            >この問題を追加する</v-btn
          >
          <v-checkbox
            v-model="showAll"
            class="mt-1"
            hide-details
            label="27問以降も表示する"
          />
        </v-col>
      </v-row>
    </v-card-text>
    <v-dialog v-model="modal">
      <ManageContestsProblemAddListCard
        ref="problemListCard"
        :items="unsetProblems || []"
        @close="modal = false"
        @add="addProblem"
      />
    </v-dialog>
  </v-card>
</template>

<style scoped lang="scss">
.cursor-pointer {
  cursor: pointer;
}
.problem-link {
  text-decoration: none;
}
</style>
