<script setup lang="ts">
import type { Problem } from '~/types/contestAdmin'
import type { ProblemDetail } from '~/types/problems'
import { manageProblemsApi } from '~/utils/apis'

import { Positions } from '~/constants/contests'
import type { ProblemType } from '~/components/manage/contests/ProblemCardTable.vue'

const props = defineProps<{
  usedPositions: Set<string>
  loading?: boolean
  unsetProblems: Problem[]
  // 現在のコンテストの問題
  tasks: ProblemType[]
  // 編集中の問題 (null なら追加モード)
  editingProblem: ProblemType | null
}>()

const emits = defineEmits<{
  add: [problemId: number, position: string]
  move: [taskSlug: string, position: string]
  remove: [taskSlug: string]
  cancelEdit: []
}>()

const manageProblemsRepo = manageProblemsApi()
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
  const list = Positions.slice(0, showAll.value ? Positions.length : 26)
  // 編集モードでは使われている位置も選べる (入れ替えになる)
  if (props.editingProblem) return list
  return list.filter((p) => !props.usedPositions.has(p))
})

// 編集モードで、選んだ位置にある別の問題
const swapTarget = computed(() => {
  const editing = props.editingProblem
  if (!editing) return null
  return (
    props.tasks.find(
      (t) => t.position === position.value && t.id !== editing.id
    ) ?? null
  )
})

watch(
  () => props.editingProblem,
  (editing) => {
    problemId.value = null
    problem.value = null
    status.value = ''
    if (editing) {
      position.value = editing.position ?? ''
      showAll.value = Positions.indexOf(position.value) >= 26
    } else {
      position.value = ''
      showAll.value = false
    }
  }
)

const showProblem = async () => {
  if (!problemId.value) return
  status.value = 'loading'
  try {
    problem.value = await manageProblemsRepo.get(problemId.value)
    status.value = 'ok'
    position.value = positions.value[0] || ''
  } catch {
    status.value = 'error'
    problem.value = null
  }
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

const move = () => {
  const editing = props.editingProblem
  if (!editing?.slug) return
  emits('move', editing.slug, position.value)
}

const remove = () => {
  const slug = props.editingProblem?.slug
  if (!slug) return
  emits('remove', slug)
}

const tableTasks = computed(
  () => [props.editingProblem ?? problem.value!] as ProblemType[]
)
</script>

<template>
  <v-card :loading="loading">
    <v-card-title>{{ editingProblem ? '問題を編集' : '問題を追加' }}</v-card-title>
    <v-card-text>
      <v-row v-if="!editingProblem">
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
          <v-btn
            color="cyan-lighten-1"
            block
            variant="tonal"
            prepend-icon="mdi-list-box-outline"
            @click="modal = true"
          >
            問題一覧から入力
          </v-btn>
        </v-col>
      </v-row>
      <v-row class="justify-end">
        <v-col cols="12">
          <ManageContestsProblemCardTable
            v-if="editingProblem"
            problem-mode
            :tasks="tableTasks"
          />
          <p
            v-else-if="problemMessage"
            class="text-red"
            v-text="problemMessage"
          />
          <ManageContestsProblemCardTable
            v-else-if="problem"
            problem-mode
            :tasks="tableTasks"
          />
        </v-col>
      </v-row>
      <v-row v-if="editingProblem || (problem && !problemMessage)">
        <v-col cols="4" sm="3" lg="2">
          <v-select
            v-model="position"
            variant="outlined"
            density="compact"
            label="位置"
            :items="positions"
            :hide-details="!!swapTarget"
          />
          <p v-if="swapTarget" class="text-caption mt-1">
            「{{ swapTarget.name }}」と入れ替えます
          </p>
        </v-col>
        <v-col v-if="editingProblem" cols="8" sm="9" lg="10">
          <div class="d-flex flex-wrap ga-2">
            <v-btn
              color="primary"
              prepend-icon="mdi-swap-vertical"
              :disabled="!position || position === editingProblem.position"
              @click="move"
            >
              位置を変更する
            </v-btn>
            <v-btn color="red" prepend-icon="mdi-delete" @click="remove">
              コンテストから削除
            </v-btn>
            <v-spacer />
            <v-btn color="red" variant="text" prepend-icon="mdi-close" @click="emits('cancelEdit')">
              キャンセル
            </v-btn>
          </div>
          <v-checkbox
            v-model="showAll"
            class="mt-1"
            hide-details
            label="27問以降も表示する"
          />
        </v-col>
        <v-col v-else cols="8" sm="6" lg="4">
          <v-btn
            color="green-darken-2"
            prepend-icon="mdi-plus"
            :disabled="!position"
            @click="add"
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
