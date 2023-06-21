<script setup lang="ts">
import { SubmissionResult } from '~/types/submissions'
import { PropType } from 'vue'

const TOOLTIP_TEXT: Record<SubmissionResult, string> = {
  AC: '正解 (Accepted)',
  TLE: '実行時間制限を超過 (Time Limit Exceeded)',
  WA: '不正解 (Wrong Answer)',
  RE: '実行時エラー (Runtime Error)',
  OLE: '出力制限超過 (Output Limit Exceeded)',
  MLE: 'メモリ制限超過 (Memory Limit Exceeded)',
  IE: '内部エラー (Internal Error)',
  CE: 'コンパイルエラー (Compilation Error)',
  WJ: 'ジャッジ待ち (Waiting Judge)',
  WR: 'リジャッジ待ち (Waiting Rejudge)',
  IC: 'コンパイル中 (In Compile)'
}

const icon = computed(
  () =>
    ({
      AC: 'mdi-check',
      TLE: 'mdi-timer-sand-full',
      WA: 'mdi-close-thick',
      CE: 'mdi-wrench',
      RE: 'mdi-alert-circle',
      OLE: 'mdi-close-thick',
      MLE: 'mdi-close-thick',
      IE: 'mdi-skull',
      WJ: '',
      WR: '',
      IC: ''
    }[props.status])
)
const props = defineProps({
  status: {
    type: String as PropType<SubmissionResult>,
    required: true
  },
  dense: Boolean,
  judgeStatus: {
    type: Object as PropType<{ completed: number; all: number } | null>,
    default: null
  }
})

const tooltipText = computed(() => {
  if (props.judgeStatus && props.status === 'WJ') return 'ジャッジ中'
  return TOOLTIP_TEXT[props.status]
})

const text = computed(() => {
  if (!props.judgeStatus) {
    return props.status
  }
  return props.status === 'WJ'
    ? `${props.judgeStatus.completed}`
    : `${props.status}`
})
const smallText = computed(() => {
  if (!props.judgeStatus) return null
  return props.status === 'WJ'
    ? `/ ${props.judgeStatus.all}`
    : `${props.judgeStatus.completed}/${props.judgeStatus.all}`
})
</script>
<template>
  <v-tooltip location="top" text="tooltipText">
    <template #activator="{ props: p }">
      <div
        :class="[
          `result-${status}`,
          dense && 'chip-dense',
          judgeStatus && 'chip-judging'
        ]"
        v-bind="p"
      >
        <v-progress-circular
          v-if="judgeStatus"
          :size="dense ? 16 : 24"
          :width="dense ? 4 : 5"
          :model-value="(judgeStatus.completed / judgeStatus.all) * 100"
          :rotate="180"
          class="mr-1"
          bg-color="white"
          :color="['WJ', 'WR'].includes(status) ? 'cyan' : 'orange'"
        />
        <v-progress-circular
          v-else-if="['WJ', 'WR', 'IC'].includes(status)"
          :size="dense ? 16 : 24"
          :width="2"
          :rotate="180"
          color="white"
          class="mr-1"
          indeterminate
        />
        <v-icon v-else class="mr-1 icon" size="small">{{ icon }}</v-icon>
        {{ text }}
        <span v-if="smallText" class="chip-subtext">{{ smallText }}</span>
      </div>
    </template>
    <span v-text="tooltipText" />
  </v-tooltip>
</template>

<style scoped lang="scss">
$color-ac: #12971e;
$color-wa: #dfa000;
$color-wj: #888888;
$color-ie: #d13232;
$color-ce: #a544ff;
[class^='result'] {
  display: inline-block;
  border-radius: 4px;
  color: white;
  font-weight: bold;
  font-size: 110%;
  box-sizing: content-box;
  height: 1.5em;
  min-width: 65px;
  width: auto;
  text-align: center;
  padding: 0.2em 10px;
  cursor: default;
  > .icon {
    margin-top: -2px;
  }
}
.chip-dense {
  font-size: 100%;
  min-width: 56px;
}
.chip-subtext {
  padding-left: 0.15em;
  font-size: 0.9em;
}

.result-AC {
  background-color: $color-ac;
}
.result-TLE,
.result-MLE,
.result-WA,
.result-RE,
.result-OLE {
  background-color: $color-wa;
}
.result-IE {
  background-color: $color-ie;
}
.result-CE {
  background-color: $color-ce;
}
.result-WJ,
.result-WR,
.result-IC {
  background-color: $color-wj;
}
</style>