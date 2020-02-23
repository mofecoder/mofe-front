<template>
  <div class="table-header">
    <div class="table-header__title">問題名</div>
    <div class="table-header__title">writer</div>
    <div class="table-header__title">tester</div>
    <div class="table-header__title">難易度</div>
    <div class="table-header__title">配点</div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
@Component
export default class ContestAdminProblemsCardTableHeader extends Vue {}
</script>

<style scoped lang="scss">
.table-header {
  width: 100%;
  display: grid;
  grid-template-columns: 5fr 2fr 2fr 80px 50px;
  border-top: #555555 solid 1px;
  border-left: #555555 solid 1px;
}
.table-header__title {
  border-right: #555555 solid 1px;
  border-bottom: #555555 double 3px;
  padding: 2px 6px;
  text-align: center;
  color: #333333;
}
</style>
