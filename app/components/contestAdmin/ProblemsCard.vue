<template>
  <v-card>
    <v-card-title>問題一覧</v-card-title>
    <v-card-text>
      <ProblemsCardTable
        :contest-slug="contestSlug"
        :tasks="tasks"
        @remove="remove"
      />
    </v-card-text>
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

  @Prop()
  contestSlug?: string

  @Emit()
  add() {}

  @Emit()
  remove(slug: string) {
    return slug
  }
}
</script>

<style scoped></style>
