<template>
  <div class="table-wrapper">
    <div v-for="problem in problems" :key="problem.slug" class="table-content">
      <div class="table-content__content">{{ problem.problemName }}</div>
      <div class="table-content__content">
        <a :href="problem.writer.link">
          {{ problem.writer.name }}
        </a>
      </div>
      <div class="table-content__content">
        <a :href="problem.tester.link">
          {{ problem.tester.name }}
        </a>
      </div>
      <div class="table-content__content">{{ problem.difficulty }}</div>
      <div class="table-content__content">{{ problem.points }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Problem } from '~/types/contestAdmin'

@Component
export default class ContestAdminProblemsCardTableHeader extends Vue {
  problems: Problem[] = [
    {
      slug: 'A',
      problemName: 'earlgrayくんの徒歩旅行',
      writer: {
        name: 'earlgray'
      },
      tester: {
        name: 'kichi2004',
        link: 'https://twitter.com/kichi2004_'
      },
      difficulty: 'Ceylon',
      points: 200
    },
    {
      slug: 'B',
      problemName: '茶碗蒸しくんの鉄道旅行',
      writer: {
        name: 'tyawanmusi',
        link: 'https://twitter.com/tyawanmusi512'
      },
      tester: {
        name: 'kichi2004',
        link: 'https://twitter.com/kichi2004_'
      },
      difficulty: 'Darjeeling',
      points: 1000
    }
  ]
}
</script>

<style scoped lang="scss">
.table-content {
  width: 100%;
  display: grid;
  grid-template-columns: 5fr 2fr 2fr 80px 50px;
  border-left: #555555 solid 1px;
}
.table-content__content {
  border-right: #555555 solid 1px;
  border-bottom: #555555 solid 1px;
  padding: 2px 6px;
  text-align: center;
  color: black;
}
</style>
