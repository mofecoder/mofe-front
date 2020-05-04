<template>
  <v-simple-table>
    <thead>
      <tr>
        <th />
        <th>問題名</th>
        <th>writer</th>
        <th>難易度</th>
        <th>配点</th>
        <th />
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in items" :key="item.name">
        <td>{{ item.position }}</td>
        <td>{{ item.name }}</td>
        <td>{{ item.writerUser }}</td>
        <td>{{ item.difficulty }}</td>
        <td>{{ item.points }}</td>
        <td>
          <div style="cursor:pointer" @click="remove(item.slug)">
            <v-icon small color="red">mdi-delete</v-icon>
          </div>
        </td>
      </tr>
    </tbody>
  </v-simple-table>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'nuxt-property-decorator'
import { Task } from '~/types/contestAdmin'

type ItemType = {
  position: string
  name: string
  difficulty: string
  points: string
  writerUser: string
  slug: string
}

@Component
export default class ProblemsCardTable extends Vue {
  @Prop()
  tasks?: Task[]

  get items(): ItemType[] {
    if (!this.tasks) return []
    return this.tasks.map<ItemType>((task) => ({
      position: task.position,
      name: task.name,
      difficulty: task.difficulty,
      writerUser: task.writerUser,
      points: task.points.toString(),
      slug: task.slug
    }))
  }

  @Emit()
  remove(slug: string) {
    return slug
  }
}
</script>

<style scoped lang="scss"></style>
