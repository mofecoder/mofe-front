<template>
  <div :class="`result-${status}`">{{ status }}</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component
export default class ResultChip extends Vue {
  @Prop()
  status!: string
}
</script>

<style scoped lang="scss">
$color-ac: #11bb22;
$color-wa: #f0b000;
$color-wj: #888888;
$color-ie: #ff4444;
$color-ce: #cc44ff;
[class^='result'] {
  border-radius: 4px;
  color: white;
  font-weight: bold;
  font-size: 120%;
  width: 3.3em;
  height: 1.4em;
  text-align: center;
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
