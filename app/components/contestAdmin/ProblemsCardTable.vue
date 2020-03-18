<template>
  <v-simple-table>
    <thead>
      <tr>
        <th />
        <th>問題名</th>
        <th>writer</th>
        <th>難易度</th>
        <th>配点</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in items" :key="item.name">
        <td>{{ item.position }}</td>
        <td>{{ item.name }}</td>
        <td>{{ item.writerUser }}</td>
        <td>{{ item.difficulty }}</td>
        <td>{{ item.points }}</td>
      </tr>
    </tbody>
  </v-simple-table>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { Problem } from '~/types/contestAdmin'

type ItemType = {
  position: string
  name: string
  difficulty: string
  points: string
  writerUser: string
}

@Component
export default class ProblemsCardTable extends Vue {
  @Prop()
  tasks?: Problem[]

  get items(): ItemType[] {
    if (!this.tasks) return []
    return this.tasks.map<ItemType>((task) => ({
      position: task.position,
      name: task.name,
      difficulty: task.difficulty,
      writerUser: task.writerUser,
      points: task.points.toString()
    }))
  }

  // edit(item: ItemType) {
  // console.log(item)
  // }
}
</script>

<style scoped lang="scss"></style>
