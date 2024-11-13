<script setup lang="ts">
import Contests from '~/utils/apis/Contests'
import { useUserStore } from '~/store/user'
import { formatDate } from '~/utils/formatting'

definePageMeta({
  layout: 'contest'
})

const { contest, contestName, clarifications, updateClarifications } =
  useContest()

await updateClarifications(true)
useHead(() => ({
  title: `質問 - ${contest.value?.name}`
}))

const editingId = ref<number | null>(null)
const questionFlag = ref(false)

const answer = (id: number) => {
  editingId.value = id
}

const closeAnswer = async (reload: boolean) => {
  if (reload) {
    await updateClarifications(true)
  }
  editingId.value = null
}

const question = () => {
  questionFlag.value = true
}

const submitQuestion = async (task: string | null, content: string) => {
  await api(
    Contests.createClarification,
    [contestName.value!],
    {},
    {
      clarification: { task, question: content }
    }
  )
  await updateClarifications(true)
  questionFlag.value = false
}

const closeQuestion = () => {
  questionFlag.value = false
}

const user = useUserStore().user
</script>
<template>
  <v-card :loading="!clarifications" flat density="comfortable">
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
            <template v-if="clar.task" #title>
              <NuxtLink
                v-if="clar.task"
                :to="`/contests/${contestName}/tasks/${clar.task.slug}`"
                class="text-decoration-none text-grey-darken-3"
                append
              >
                {{ clar.task!.position }} - {{ clar.task!.name }}
              </NuxtLink>
            </template>
            <template #text>
              <div class="text-pre-wrap text-body-1">
                {{ clar.question }}
              </div>
              <div class="text-grey-darken-2 mt-4 text-body-2">
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
          <v-card v-else :key="`${clar.id}_c`" class="mb-6">
            <template v-if="clar.task" #title>
              <NuxtLink
                v-if="clar.task"
                :to="`/contests/${contestName}/tasks/${clar.task.slug}`"
                class="mt-4 text-decoration-none text-grey-darken-3"
                append
              >
                {{ clar.task!.position }} - {{ clar.task!.name }}
              </NuxtLink>
            </template>
            <template #text>
              <v-timeline
                align="start"
                side="end"
                class="clar-timeline"
                density="comfortable"
              >
                <v-timeline-item
                  :dot-color="clar.answer ? 'green' : 'grey'"
                  hide-opposite
                  size="small"
                  width="100%"
                >
                  <div class="text-h6 font-weight-bold">
                    <div>
                      {{ clar.user }}
                    </div>
                    <div class="text-body-1 flex-shrink-0">
                      {{ formatDate(clar.createdAt) }}
                    </div>
                  </div>
                  <div class="text-pre-wrap text-body-1 mt-2">
                    {{ clar.question }}
                  </div>
                </v-timeline-item>
                <v-timeline-item
                  v-if="clar.answer"
                  dot-color="red"
                  hide-opposite
                  size="small"
                  width="100%"
                >
                  <div class="text-h6 font-weight-bold">
                    <div>回答</div>
                    <div class="text-body-1 flex-shrink-0">
                      {{ formatDate(clar.updatedAt) }}
                    </div>
                  </div>
                  <div class="text-pre-wrap text-body-1 mt-2">
                    {{ clar.answer }}
                  </div>
                </v-timeline-item>
              </v-timeline>
            </template>
            <template v-if="clar.canAnswer" #actions>
              <v-btn
                v-if="clar.canAnswer"
                variant="tonal"
                color="green"
                :prepend-icon="
                  clar.answer != null ? 'mdi-comment-edit-outline' : 'mdi-reply'
                "
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
.clar-timeline {
  grid-template-columns: 0 min-content auto !important;
}
</style>
