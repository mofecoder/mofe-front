<script setup lang="ts">
import { Task } from '~/types/contestAdmin'
export type ProblemType = Task & {
  id: number
  writerUser?: string
  position?: string
  points?: number
}

const props = defineProps<{
  tasks?: ProblemType[]
  contestSlug?: string
  problemMode?: boolean
}>()

const emits = defineEmits<{
  remove: [string]
}>()
type ItemType = {
  id: number
  position?: string
  name: string
  difficulty: string
  points?: string
  writerUser: string
  slug?: string
}
const items = computed(() => {
  return (
    props.tasks?.map<ItemType>((task) => ({
      id: task.id,
      position: task.position,
      name: task.name,
      difficulty: task.difficulty,
      writerUser: task.writerUser,
      points: task.points?.toString(),
      slug: task.slug
    })) || []
  )
})
</script>

<template>
  <v-table>
    <thead>
      <tr>
        <th v-if="!problemMode" />
        <th>ID</th>
        <th>問題名</th>
        <th>writer</th>
        <th>難易度</th>
        <th v-if="!problemMode">配点</th>
        <th v-if="!problemMode" />
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in items" :key="item.name">
        <td v-if="!problemMode">{{ item.position }}</td>
        <td>{{ item.id }}</td>
        <td>{{ item.name }}</td>
        <td>{{ item.writerUser }}</td>
        <td>{{ item.difficulty }}</td>
        <template v-if="!problemMode">
          <td>{{ item.points }}</td>
          <td>
            <v-btn
              icon
              variant="text"
              :to="`/contests/${contestSlug}/tasks/${item.slug}`"
            >
              <v-icon size="small">mdi-eye</v-icon>
            </v-btn>
            <v-btn
              icon
              variant="text"
              color="red"
              @click="emits('remove', item.slug!)"
            >
              <v-icon size="small" color="red">mdi-delete</v-icon>
            </v-btn>
          </td>
        </template>
      </tr>
    </tbody>
  </v-table>
</template>

<style scoped lang="scss"></style>
