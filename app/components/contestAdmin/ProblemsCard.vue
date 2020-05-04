<template>
  <v-card>
    <v-card-title>
      <v-row class="px-4" justify="space-between">
        <div>問題一覧</div>
        <v-btn color="primary" :disabled="tasks.length >= 10" @click="add"
          >問題を追加</v-btn
        >
      </v-row>
    </v-card-title>
    <ProblemsCardTable :tasks="tasks" @remove="remove" />
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'nuxt-property-decorator'
import { Task } from '~/types/contestAdmin'
import ProblemsCardTable from '~/components/contestAdmin/ProblemsCardTable.vue'
@Component({
  components: { ProblemsCardTable }
})
export default class ProblemsCard extends Vue {
  @Prop()
  tasks?: Task[]

  @Emit()
  add() {}

  @Emit()
  remove(slug: string) {
    return slug
  }
}
</script>

<style scoped></style>
