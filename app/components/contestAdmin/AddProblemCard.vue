<template>
  <v-card :loading="!items || loading">
    <v-card-title>問題を追加</v-card-title>
    <v-card-text v-if="items">
      <v-simple-table>
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
              <div style="cursor:pointer" @click="add(item)">
                <v-icon color="blue">mdi-plus</v-icon>
              </div>
            </td>
            <td>{{ item.name }}</td>
            <td>{{ item.difficulty }}</td>
            <td>{{ item.writerUser }}</td>
            <td>
              <div style="cursor:pointer">
                <a
                  :href="`/problems/${item.id}`"
                  target="_blank"
                  style="text-decoration:none"
                >
                  <v-icon small>mdi-eye</v-icon>
                </a>
              </div>
            </td>
          </tr>
        </tbody>
      </v-simple-table>
    </v-card-text>
    <v-card-actions>
      <v-btn block color="primary" @click="$emit('close')">閉じる</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'nuxt-property-decorator'
import { Problem } from '~/types/contestAdmin'

@Component
export default class AddProblemCard extends Vue {
  @Prop()
  loading?: boolean

  @Prop({ required: true })
  items!: Problem[]

  @Emit()
  add(item: Problem) {
    return item
  }
}
</script>

<style scoped lang="scss"></style>
