<script setup lang="ts">
import { tasksApi } from '~/utils/apis'

definePageMeta({
  layout: 'contest'
})

const { contest, contestName } = useContest()
const route = useRoute()
const slug = computed(
  () =>
    (Array.isArray(route.params.slug)
      ? route.params.slug[0]
      : route.params.slug) || ''
)
const tasksRepo = tasksApi()
const { data: problem, error } = await useAsyncData(
  () => `task:${contestName.value}:${slug.value}`,
  () => tasksRepo.get({ contestSlug: contestName.value!, taskSlug: slug.value })
)

useHead(() => ({
  title:
    problem.value && contest.value
      ? `${problem.value.position}. ${problem.value.name} - ${contest.value.name}`
      : 'Loading...',
  titleTemplate: null
}))

const errorMessage = error.value?.message
const id = computed(
  () =>
    contest.value?.writtenTasks.filter(
      (t) => t.slug === unref(slug) && t.role !== 'tester'
    )[0]?.id || null
)
</script>

<template>
  <v-alert v-if="errorMessage" type="error">
    {{ errorMessage }}
  </v-alert>
  <v-container v-else-if="problem" class="pa-0" fluid>
    <ProblemsViewProblemCard
      :id="id"
      :problem="problem"
      :contest-slug="contestName"
      :is-writer="
        contest != null && (contest.isWriterOrTester || contest.isAdmin)
      "
    />
    <v-card class="mt-4 mx-auto" max-width="1200px" title="提出">
      <div class="pa-3">
        <ContestsSubmitForm :problem="problem" :contest-slug="contestName!" />
      </div>
    </v-card>
  </v-container>
</template>

<style scoped lang="scss"></style>
