<script lang="ts" setup>
import dayjs from 'dayjs'
import type { ContestDetail } from '~/types/contest'
import type { PropType } from 'vue'

const props = defineProps({
  contest: {
    type: Object as PropType<ContestDetail>,
    required: true
  },
  contestName: {
    type: String,
    required: true
  },
  unreadClarifications: {
    type: Number,
    default: 0
  }
})

const afterContest = computed(() => {
  return props.contest && dayjs(props.contest.endAt).isBefore(Date())
})
</script>

<template>
  <v-list color="primary">
    <v-list-item
      :to="`/contests/${contestName}`"
      exact
      prepend-icon="mdi-home-outline"
      title="トップ"
    >
    </v-list-item>
    <v-list-item
      :to="`/contests/${contestName}/tasks`"
      exact
      prepend-icon="mdi-format-list-bulleted"
      title="問題"
    >
    </v-list-item>
    <v-list-group v-if="contest && contest.tasks && contest.tasks.length">
      <template #activator="{ props: p }">
        <v-list-item v-bind="p" prepend-icon="mdi-magnify" title="問題一覧" />
      </template>
      <v-list-item
        v-for="task in contest.tasks"
        :key="task.slug"
        :to="`/contests/${contestName}/tasks/${task.slug}`"
        density="compact"
        :prepend-icon="
          task.position.length == 1
            ? `mdi-alpha-${task.position.toLowerCase()}-box`
            : 'mdi-pound-box-outline'
        "
        :title="task.name"
        :subtitle="task.difficulty"
      />
    </v-list-group>
    <v-list-item
      :to="`/contests/${contestName}/clarifications`"
      prepend-icon="mdi-comment-question-outline"
      title="質問"
    >
      <template v-if="unreadClarifications" #append>
        <v-badge color="primary" inline :content="unreadClarifications" />
      </template>
    </v-list-item>
    <v-list-item
      :to="`/contests/${contestName}/submissions`"
      :disabled="!contest || (!afterContest && !contest.writtenTasks.length)"
      prepend-icon="mdi-list-status"
      title="すべての提出"
    />
    <v-list-item
      :to="`/contests/${contestName}/submissions/me`"
      exact
      prepend-icon="mdi-account-details"
      title="自分の提出"
    />
    <v-list-item
      :to="`/contests/${contestName}/standings`"
      prepend-icon="mdi-sort-variant"
      title="順位表"
    />
    <v-list-item
      v-if="afterContest || (contest && contest.editorial)"
      :href="contest.editorial ?? undefined"
      :disabled="contest.editorial == null"
      target="_blank"
      prepend-icon="mdi-file-document-outline"
      title="解説"
    />
  </v-list>
</template>

<style scoped lang="scss">
.clarifications-unread {
  display: inline-block;
  background: mediumblue;
  color: white;
  border-radius: 8px;
  width: 2em;
  text-align: center;
  margin-left: 0.4em;
}
</style>
