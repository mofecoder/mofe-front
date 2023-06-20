<script setup lang="ts">
definePageMeta({
  layout: 'contest'
})

const { contest, contestName } = useContest()

useHead({
  title: `問題 - ${contest.value?.name}`,
  titleTemplate: null
})
</script>

<template>
  <div>
    <template v-if="contest">
      <v-alert v-if="!contest.tasks">
        <v-alert type="warning">問題はまだ公開されていません。</v-alert>
      </v-alert>
      <v-container v-else class="pa-0" fluid>
        <v-card max-width="600px">
          <v-list rounded>
            <v-list-subheader>問題一覧</v-list-subheader>
            <v-list-item
              v-for="problem in contest.tasks"
              :key="problem.slug"
              :to="`/contests/${contestName}/tasks/${problem.slug}`"
              :prepend-icon="`mdi-alpha-${problem.position.toLowerCase()}-box`"
              :title="problem.name"
              :subtitle="problem.difficulty"
              density="comfortable"
            >
            </v-list-item>
          </v-list>
        </v-card>
      </v-container>
    </template>
  </div>
</template>

<style scoped lang="scss">
.position {
  display: inline-flex;
  background: #9544aa;
  color: #ffffff;
  width: 2rem;
  height: 2rem;
  margin-right: 1.4rem;
  justify-content: center;
  border-radius: 8px;
  align-items: center;
  align-self: center;
}
.content {
  width: 100%;
  justify-content: space-between;
  flex-wrap: unset;
  flex: unset;
  overflow: unset;
}
</style>
<style>
.v-list-item__content > * {
  flex: unset !important;
}
</style>
