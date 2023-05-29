<template>
  <v-table>
    <thead>
      <tr>
        <th v-if="!problemMode" />
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
        <td>{{ item.name }}</td>
        <td>{{ item.writerUser }}</td>
        <td>{{ item.difficulty }}</td>
        <td v-if="!problemMode">{{ item.points }}</td>
        <td v-if="!problemMode">
          <NuxtLink
            class="link"
            :to="`/contests/${contestSlug}/tasks/${item.slug}`"
          >
            <v-icon size="small">mdi-eye</v-icon>
          </NuxtLink>
          <span class="cursor-pointer" @click="remove(item.slug)">
            <v-icon size="small" color="red">mdi-delete</v-icon>
          </span>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'nuxt-property-decorator'
import { Task } from '~/types/contestAdmin'

type ItemType = {
  position?: string
  name: string
  difficulty: string
  points?: string
  writerUser: string
  slug?: string
}

@Component
export default class ProblemsCardTable extends Vue {
  @Prop()
  tasks?: Task[]

  @Prop()
  contestSlug?: string

  @Prop({ type: Boolean, default: false })
  problemMode!: boolean

  get items(): ItemType[] {
    if (!this.tasks) return []
    return this.tasks.map<ItemType>((task) => ({
      position: task.position,
      name: task.name,
      difficulty: task.difficulty,
      writerUser: task.writerUser,
      points: task.points?.toString(),
      slug: task.slug
    }))
  }

  @Emit()
  remove(slug: string) {
    return slug
  }
}
</script>

<style scoped lang="scss">
.cursor-pointer {
  cursor: pointer;
}
.link {
  text-decoration: none;
}
</style>
