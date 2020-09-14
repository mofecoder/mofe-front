<template>
  <div
    :class="[
      `result-${status}`,
      isDense && 'chip-dense',
      judgeStatus && 'chip-judging'
    ]"
    v-text="text"
  ></div
></template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class ResultChip extends Vue {
  @Prop({ required: true })
  status!: string

  @Prop({ default: false })
  dense!: string | boolean

  @Prop({ default: null })
  judgeStatus!: { completed: number; all: number } | null

  get text() {
    if (!this.judgeStatus) {
      return this.status
    }
    return this.status === 'WJ'
      ? `${this.judgeStatus.completed}/${this.judgeStatus.all}`
      : `${this.status} ${this.judgeStatus.completed}/${this.judgeStatus.all}`
  }

  get isDense() {
    return this.dense || this.dense === ''
  }
}
</script>

<style scoped lang="scss">
$color-ac: #11bb22;
$color-wa: #f0b000;
$color-wj: #888888;
$color-ie: #ff4444;
$color-ce: #cc44ff;
[class^='result'] {
  display: inline-block;
  border-radius: 4px;
  color: white;
  font-weight: bold;
  font-size: 110%;
  box-sizing: content-box;
  width: max-content;
  height: 1.4em;
  text-align: center;
  padding-left: 1em;
  padding-right: 1em;
}
.chip-dense {
  font-size: 100%;
}
.chip-judging {
  padding-left: 0.5em;
  padding-right: 0.5em;
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
.result-WR {
  background-color: $color-wj;
}
</style>
