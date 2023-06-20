<script setup lang="ts">
import Contests from '~/utils/apis/Contests'
import { useUserStore } from '~/store/user'
import { formatDate } from '~/utils/formatting'

definePageMeta({
  layout: 'contest'
})

const { contest, contestName, clarifications, updateClarifications } =
  useContest()

useHead({
  title: `質問 - ${contest.value?.name}`
})

const editingId = ref<number | null>(null)
const questionFlag = ref(false)

const answer = (id: number) => {
  editingId.value = id
}

const closeAnswer = async (reload: boolean) => {
  if (reload) {
    await updateClarifications()
  }
  editingId.value = null
}

const question = () => {
  questionFlag.value = true
}

const submitQuestion = async (task: string | null, content: string) => {
  await useApi(
    Contests.createClarification,
    [contestName.value],
    {},
    { task, question: content }
  )
  await updateClarifications()
  questionFlag.value = false
}

const closeQuestion = () => {
  questionFlag.value = false
}

const showAnswer = computed(
  () => clarifications.value && clarifications.value.some((x) => x.canAnswer)
)

const user = useUserStore().user
</script>
<template>
  <v-card :loading="!clarifications" flat>
    <v-card-title>質問</v-card-title>
    <v-card-text v-if="contest" class="text-black">
      <template v-if="clarifications && clarifications.length">
        <template v-for="clar in clarifications">
          <v-alert
            v-if="clar.publish && !clar.answer"
            :key="clar.id"
            variant="tonal"
            icon="mdi-bell"
            type="warning"
            class="mb-6"
          >
            <template #text>
              {{ clar.question }}
              <div class="text-grey-darken-2 mt-6">
                投稿日時：{{ formatDate(clar.createdAt) }}
                <br />
                更新日時：{{ formatDate(clar.updatedAt) }}
              </div>
              <v-btn
                v-if="clar.canAnswer"
                class="mt-4"
                color="orange-lighten-3"
                @click="answer(clar.id)"
              >
                編集・回答する
              </v-btn>
            </template>
          </v-alert>
          <v-card
            v-else
            :key="clar.id"
            class="mb-6"
            prepend-icon="mdi-chat-question"
          >
            <template #title>
              {{ clar.question }}
            </template>
            <template v-if="clar.task" #subtitle>
              <NuxtLink
                v-if="clar.task"
                :to="`../tasks/${clar.task.slug}`"
                class="mt-4 text-decoration-none text-grey-darken-3"
                append
              >
                {{ clar.task!.position }} - {{ clar.task!.name }}
              </NuxtLink>
            </template>
            <template #text>
              {{ clar.answer }}
              <br />
              <div class="text-grey-darken-3 mt-6">
                質問者：{{ clar.user }}
                <br />
                投稿日時：{{ formatDate(clar.createdAt) }}
                <br />
                更新日時：{{ formatDate(clar.updatedAt) }}
              </div>
            </template>
            <template v-if="clar.canAnswer" #actions>
              <v-btn
                v-if="clar.canAnswer"
                variant="tonal"
                color="green"
                @click="answer(clar.id)"
                >{{ clar.answer != null ? '回答を編集' : '回答する' }}</v-btn
              >
            </template>
          </v-card>
        </template>
      </template>
      <v-alert v-else type="success" text="質問はありません" />

      <ContestsClarificationsQuestionModal
        :tasks="contest.tasks!"
        :value="questionFlag"
        @submit="submitQuestion"
        @close="closeQuestion"
      />
      <ContestsClarificationsAnswerModal
        v-if="editingId !== null"
        :contest-slug="contest.slug"
        :clarification-id="editingId"
        @close="closeAnswer"
      />
      <v-btn
        v-if="user"
        variant="elevated"
        class="mt-4"
        color="primary"
        @click="question"
      >
        質問する
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<style scoped lang="scss">
.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 90%;

  tr,
  th,
  td {
    border: solid 1px black;
  }

  td {
    padding: 0.2em 0.5em;
  }

  &__wrapper {
    overflow-x: scroll;
  }

  &__task {
    min-width: 9em;
  }

  &__user {
    min-width: 6em;
    white-space: nowrap;
  }

  &__publish {
    width: 4em;
  }

  &__question,
  &__answer {
    min-width: 15em;
  }

  &__created,
  &__updated {
    width: 5em;
  }

  &__question-data,
  &__answer-data {
    white-space: pre-wrap;
  }

  &__answer-btn-data {
    text-align: center;
  }

  &__publish-data--true {
    color: green;
  }
  &__publish-data--false {
    color: gray(50);
  }
}
</style>
