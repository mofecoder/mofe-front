<script setup lang="ts">
import { VForm } from 'vuetify/components'
import ManageProblems from '~/utils/apis/ManageProblems'
import AggregateTypes from '~/constants/aggregateTypes'
import type { AggregateType } from '~/types/problems'

const props = defineProps<{
  value: boolean
  readonly?: boolean
  problemId: number
  id: number | null
  testcaseSetNames: string[]
}>()

const ok = ref(false)
const loading = ref(false)
type ParamsType = {
  name: string
  points: string
  aggregateType: AggregateType
}
const params = ref<ParamsType>({
  name: '',
  points: '0',
  aggregateType: 'all'
})

const rules = {
  required: (v: string) => !!v || 'このフィールドは必須です。',
  name: (v: string) => /^\w+$/.test(v) || 'テストケースセット名が無効です。',
  points: (v: string) =>
    /^\d{1,8}$/.test(v) || '配点は 0 点以上 1 億点未満にしてください。'
}

const emits = defineEmits<{
  close: []
  save: [params: ParamsType]
}>()

const startName = ref('')
const form = ref<VForm | null>(null)
watch(
  () => props.value,
  async () => {
    if (!props.value) return
    if (props.id == null) {
      startName.value = ''
      params.value = {
        name: '',
        points: '0',
        aggregateType: 'all'
      }
      form.value?.resetValidation()
      return
    }
    loading.value = true
    const { data } = await useApi(ManageProblems.getTestcaseSet, [
      props.problemId,
      props.id
    ])
    if (data.value) {
      const { name, points } = data.value
      startName.value = name
      params.value = {
        name,
        points: points.toString(),
        aggregateType: data.value.aggregateType
      }
    }
    loading.value = false
  }
)

const scoreHint = computed(() => {
  if (params.value.aggregateType === 'all') return ''
  return '表示のみで採点には影響しません'
})

const check = (v: string) => {
  return (
    startName.value === v ||
    !props.testcaseSetNames.includes(v) ||
    'この名前のテストケースセットは既に存在します。'
  )
}

const create = () => {
  emits('save', params.value)
  params.value = {
    name: '',
    points: '0',
    aggregateType: 'all'
  }
  form.value?.resetValidation()
}

const editing = computed(() => props.id !== null)
</script>

<template>
  <v-dialog :model-value="value" persistent>
    <v-card :loading="loading">
      <v-card-title>
        テストケースセットを{{ editing ? '編集' : '追加' }}
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="ok">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="params.name"
                  label="テストケースセット名"
                  required
                  :rules="[rules.required, rules.name, check]"
                  :readonly="startName === 'sample' || startName === 'all'"
                />
              </v-col>
              <v-col cols="12" md="7">
                <v-select
                  v-model="params.aggregateType"
                  label="集計の種類"
                  :items="AggregateTypes"
                  item-title="text"
                  hide-details
                />
              </v-col>
              <v-col cols="12" md="5">
                <v-text-field
                  v-model="params.points"
                  type="number"
                  label="配点"
                  required
                  :rules="[rules.required, rules.points]"
                  :counter="8"
                  :hint="scoreHint"
                  persistent-hint
                />
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" color="red" @click="emits('close')">閉じる</v-btn>
        <v-btn variant="text" color="primary" :disabled="!ok" @click="create"
          >保存</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped lang="scss"></style>
