<script setup lang="ts">
import { Problem } from '~/types/contestAdmin'

const props = defineProps<{
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
            <td>問題名</td>
            <td>難易度</td>
            <td>writer</td>
            <td />
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id">
            <td>
              <v-btn size="small" color="accent" @click="emits('add', item)">
                この問題を選択
              </v-btn>
            </td>
            <td>{{ item.name }}</td>
            <td>{{ item.difficulty }}</td>
            <td>{{ item.writerUser }}</td>
            <td>
              <v-btn :to="`/manage/problems/${item.id}`" icon variant="text">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card-text>
    <v-card-actions>
      <v-btn block color="primary" @click="emits('close')">閉じる</v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped lang="scss"></style>
