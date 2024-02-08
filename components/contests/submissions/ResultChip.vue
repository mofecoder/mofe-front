<script setup lang="ts">
import type { PropType } from 'vue'
import type { SubmissionResult } from '~/types/submissions'

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
  CP: 'コンパイル中 (Compiling)'
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
      CP: ''
    })[props.status]
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
  },
  hideIcon: {
    type: Boolean,
    default: false
  },
  noMinWidth: {
    type: Boolean,
    default: false
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
          judgeStatus && 'chip-judging',
          noMinWidth && 'chip-no-min-width'
        ]"
        v-bind="p"
      >
        <template v-if="!hideIcon">
          <v-progress-circular
            v-if="judgeStatus"
            :size="dense ? 16 : 24"
            :width="dense ? 4 : 5"
            :model-value="(judgeStatus.completed / judgeStatus.all) * 100"
            :rotate="180"
            class="mr-1"
            bg-color="white"
            :color="['WJ', 'WR'].includes(status) ? 'cyan' : 'deep-orange'"
          />
          <v-progress-circular
            v-else-if="['WJ', 'WR', 'CP'].includes(status)"
            :size="dense ? 16 : 24"
            :width="2"
            :rotate="180"
            color="blue-grey-darken-2"
            class="mr-1"
            indeterminate
          />
          <v-icon v-else class="mr-1 icon" size="small">{{ icon }}</v-icon>
        </template>
        {{ text }}
        <span v-if="smallText" class="chip-subtext">{{ smallText }}</span>
      </div>
    </template>
    <span v-text="tooltipText" />
  </v-tooltip>
</template>

<style scoped lang="scss">
$color-ac: #12971e;
$color-wa: #df8d00;
$color-wj: #5b5b5b;
$color-ie: #d13232;
$color-ce: #a544ff;
[class^='result'] {
  display: inline-block;
  border-radius: 4px;
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
}
.chip-subtext {
  padding-left: 0.15em;
  font-size: 0.9em;
}
.chip-no-min-width {
  min-width: unset;
}

.result-AC {
  border-color: $color-ac;
  color: $color-ac;
}
.result-TLE,
.result-MLE,
.result-WA,
.result-RE,
.result-OLE {
  border-color: $color-wa;
  color: $color-wa;
}
.result-IE {
  background-color: $color-ie;
  color: white;
}
.result-CE {
  border-color: $color-ce;
  color: $color-ce;
}
.result-WJ,
.result-WR,
.result-IC,
.result-CP {
  border-color: $color-wj;
  color: $color-wj;
}
</style>
