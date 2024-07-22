<script setup lang="ts">
import type { Problem } from '~/types/contestAdmin'

defineProps<{
  items: Problem[]
  loading?: boolean
}>()
const emits = defineEmits<{
  add: [Problem]
  close: []
}>()
</script>

<template>
  <v-card :loading="!items || loading">
    <v-card-title>追加可能な問題一覧</v-card-title>
    <v-card-text v-if="items">
      <v-table>
        <thead>
          <tr>
            <td />
            <td>ID</td>
            <td>問題名</td>
            <td>難易度</td>
            <td>writer</td>
            <td />
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id">
            <td>
              <v-btn
                density="comfortable"
                color="secondary"
                variant="tonal"
                prepend-icon="mdi-import"
                block
                @click="emits('add', item)"
              >
                この問題を選択
              </v-btn>
            </td>
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.difficulty }}</td>
            <td>{{ item.writerUser }}</td>
            <td>
              <v-btn
                :to="`/manage/problems/${item.id}`"
                icon="mdi-pencil"
                density="comfortable"
                variant="text"
              />
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
    <v-card-actions>
      <v-btn block color="red" prepend-icon="mdi-close" @click="emits('close')">
        閉じる
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped lang="scss"></style>
