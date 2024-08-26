<script setup lang="ts">
import Tasks from '~/utils/apis/Tasks'
import SubmitForm from '~/components/contests/SubmitForm.vue'

definePageMeta({
  layout: 'contest'
})

const { contest, contestName } = useContest()
const route = useRoute()
const slug = computed(() =>
  Array.isArray(route.params.slug) ? route.params.slug[0] : route.params.slug
)
const { data: problem, error } = await useApi(Tasks.getTask, [
  unref(contestName),
  unref(slug)
])

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
    />
    <v-card class="mt-4 mx-auto" max-width="1200px" title="提出">
      <div class="pa-3">
        <SubmitForm :problem="problem" :contest-slug="contestName" />
      </div>
    </v-card>
  </v-container>
</template>

<style scoped lang="scss"></style>
