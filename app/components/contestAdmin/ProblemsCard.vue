<template>
  <v-card>
    <v-card-title>
      <v-row class="px-4" justify="space-between">
        <div>問題一覧</div>
        <v-btn color="primary">問題を追加</v-btn>
      </v-row>
    </v-card-title>
    <ProblemsCardTable :tasks="tasks" />
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import { Problem } from '~/types/contestAdmin'
import ProblemsCardTable from '~/components/contestAdmin/ProblemsCardTable.vue'
@Component({
  components: { ProblemsCardTable }
})
export default class ProblemsCard extends Vue {
  @Prop()
  tasks?: Problem[]
}
</script>

<style scoped></style>
