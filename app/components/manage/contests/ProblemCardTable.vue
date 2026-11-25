<script setup lang="ts">
import type { Task } from '~/types/contestAdmin'
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
  showEdit?: boolean
}>()

const emits = defineEmits<{
  edit: [number]
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
        <th v-if="!problemMode">{{ item.position }}</th>
        <td>{{ item.id }}</td>
        <td>{{ item.name }}</td>
        <td>{{ item.writerUser }}</td>
        <td>{{ item.difficulty }}</td>
        <template v-if="!problemMode">
          <td>{{ item.points }}</td>
          <td>
            <v-btn
              icon="mdi-eye"
              variant="text"
              size="small"
              density="comfortable"
              :to="`/contests/${contestSlug}/tasks/${item.slug}`"
            />
            <v-btn
              v-if="showEdit"
              icon="mdi-pencil"
              variant="text"
              size="small"
              density="comfortable"
              @click="emits('edit', item.id)"
            />
          </td>
        </template>
      </tr>
    </tbody>
  </v-table>
</template>

<style scoped lang="scss"></style>
