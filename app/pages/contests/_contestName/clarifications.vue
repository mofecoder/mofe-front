<template>
  <v-card :loading="!clarifications">
    <v-card-title>質問</v-card-title>
    <v-card-text v-if="contest" class="black--text">
      <div class="table__wrapper">
        <table v-if="clarifications && clarifications.length" class="table">
          <thead>
            <tr>
              <th class="table__task">問題</th>
              <th class="table__user">ユーザ名</th>
              <th class="table__question">質問</th>
              <th class="table__answer">回答</th>
              <th class="table__publish">公開</th>
              <th class="table__created">投稿日時</th>
              <th class="table__updated">更新日時</th>
              <th v-if="showAnswer" />
            </tr>
          </thead>
          <tbody>
            <tr v-for="clar in clarifications" :key="`clar-${clar.id}`">
              <td v-if="clar.task" class="table__task-data">
                <nuxt-link :to="`../tasks/${clar.task.slug}`" append>
                  {{ clar.task.position }} - {{ clar.task.name }}
                </nuxt-link>
              </td>
              <td v-else />
              <td class="table__user-data" v-text="clar.user" />
              <td class="table__question-data" v-text="clar.question" />
              <td class="table__answer-data" v-text="clar.answer" />
              <td
                class="table__publish-data"
                :class="`table__publish-data--${clar.publish}`"
                v-text="clar.publish ? 'Yes' : 'No'"
              />
              <td>
                <time
                  :datetime="clar.createdAt"
                  v-text="formatDate(clar.createdAt)"
                />
              </td>
              <td>
                <time
                  :datetime="clar.updatedAt"
                  v-text="formatDate(clar.updatedAt)"
                />
              </td>
              <td v-if="showAnswer" class="table__answer-btn-data">
                <v-btn
                  v-if="clar.canAnswer"
                  text
                  small
                  color="green"
                  @click="answer(clar.id)"
                  >{{ clar.answer != null ? '回答を編集' : '回答する' }}</v-btn
                >
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else>質問はありません。</p>
      </div>

      <v-btn v-if="userLoggedIn" class="mt-4" color="primary" @click="question"
        >質問する</v-btn
      >

      <ClarificationQuestionModal
        :tasks="contest.tasks"
        :value="questionFlag"
        @submit="submitQuestion"
        @close="closeQuestion"
      />
      <ClarificationAnswerModal
        v-if="editingId !== null"
        :contest-slug="contest.slug"
        :clarification-id="editingId"
        @close="closeAnswer"
      />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import dayjs from 'dayjs'
import MixinContest from '~/mixins/contest'
import { userStore } from '~/utils/store-accessor'
import ClarificationAnswerModal from '~/components/modals/ClarificationAnswerModal.vue'
import ClarificationQuestionModal from '~/components/modals/ClarificationQuestionModal.vue'

@Component({
  components: { ClarificationQuestionModal, ClarificationAnswerModal },
  layout: 'contest'
})
export default class PageContestClarifications extends mixins(MixinContest) {
  head() {
    return {
      title: `質問 - ${this.contest?.name}`,
      titleTemplate: null
    }
  }

  editingId: number | null = null
  questionFlag = false

  async fetch() {
    await this.getContest()
    localStorage.setItem(`${this.contestSlug}_clar`, dayjs().toISOString())
    await this.getClarifications()
  }

  answer(id: number) {
    this.editingId = id
  }

  async closeAnswer(reload: boolean) {
    if (reload) {
      await this.getClarifications()
    }
    this.editingId = null
  }

  question() {
    this.questionFlag = true
  }

  async submitQuestion(task: string | null, content: string) {
    await Promise.all([
      await this.$api.Contests.createClarification(
        this.contest!.slug,
        task,
        content
      ),
      this.getClarifications()
    ])
    this.questionFlag = false
  }

  closeQuestion() {
    this.questionFlag = false
  }

  formatDate(date: Date): string {
    const dt = dayjs(date)
    return dt.year() === dayjs().year()
      ? dt.format('MM/DD HH:mm:ss')
      : dt.format('YYYY/MM/DD HH:mm:ss')
  }

  get showAnswer() {
    return this.clarifications!.some((x) => x.canAnswer)
  }

  get userLoggedIn() {
    return !!userStore.getUser
  }
}
</script>

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
