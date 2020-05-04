<template>
  <v-container>
    <EditProblemCard />
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import EditProblemCard from '~/components/EditProblemCard.vue'
@Component({
  components: { EditProblemCard }
})
export default class PageWriterTaskEdit extends Vue {
  validate({ params }: { params: { [key: string]: string } }): boolean {
    return /^[1-9]\d*$/.test(params.problemId)
  }
}
</script>

<style scoped lang="scss"></style>
