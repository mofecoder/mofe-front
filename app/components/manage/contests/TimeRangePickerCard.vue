<script setup lang="ts">
import type { Dayjs } from 'dayjs'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

const props = withDefaults(
  defineProps<{
    loading?: boolean
    modelValue: [Dayjs, Dayjs]
    editButton?: boolean
    format?: string
  }>(),
  {
    format: 'YYYY-MM-DD HH:mm:ss'
  }
)
const dayjs = useDayjs()

const emits = defineEmits<{
  'update:modelValue': [value: [Dayjs, Dayjs]]
  submit: [value: [Dayjs, Dayjs]]
}>()

const range = computed({
  get: () => [props.modelValue[0].toDate(), props.modelValue[1].toDate()],

  set: ([s, t]) => {
    emits('update:modelValue', [dayjs(s), dayjs(t)])
  }
})

const formatRange = ([start, end]: [Date, Date]) => {
  const start2 = dayjs(start)
  const end2 = dayjs(end)

  const date = (a: Dayjs) =>
    a.year() === dayjs().year() ? a.format('M/D') : a.format('YYYY/M/D')

  const startD = date(start2)
  const endD = date(end2)
  return startD === endD
    ? `${startD} ${start2.format('HH:mm')} - ${end2.format('HH:mm')}`
    : `${startD} ${start2.format('HH:mm')} - ${endD} ${end2.format('HH:mm')}`
}

const isOk = computed(() => props.modelValue[0].isBefore(props.modelValue[1]))

const submit = () => {
  emits('submit', props.modelValue)
}
</script>

<template>
  <v-card class="wrapper" :loading="loading">
    <v-card-title>開催時間（日本時間）</v-card-title>
    <v-card-text>
      <v-container>
        <v-form ref="form" :model-value="isOk" lazy-validation>
          <v-row cols="12">
            <vue-date-picker
              v-model="range"
              menu-class-name="picker"
              range
              timezone="Asia/Tokyo"
              week-start="0"
              minutes-grid-increment="5"
              :teleport="true"
              :flow="['calendar', 'hours', 'minutes']"
              :format="formatRange"
            />
          </v-row>
          <v-row>
            <v-col cols="12" class="py-0">
              <span v-if="!isOk" class="text-red text--darken1">
                時刻の前後関係が一致していません
              </span>
            </v-col>
          </v-row>
          <v-row v-if="editButton">
            <v-col cols="12">
              <v-btn
                :disabled="!isOk"
                color="amber-darken-4"
                class="text-white"
                block
                prepend-icon="mdi-content-save"
                @click="submit"
              >
                変更する
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<style lang="scss">
.dp__action_row {
  flex-direction: column;
  justify-content: center;
  > div {
    margin-left: inherit;
  }
}
</style>
