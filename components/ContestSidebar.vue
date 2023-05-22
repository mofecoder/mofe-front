<script lang="ts" setup>
import dayjs from 'dayjs'
import { ContestDetail } from '~/types/contest'
import { PropType } from 'vue'

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
    <v-list-item :to="`/contests/${contestName}`" exact>
      <template #prepend><v-icon icon="mdi-home" /></template>
      <v-list-item-title>トップ</v-list-item-title>
    </v-list-item>
    <v-list-item :to="`/contests/${contestName}/tasks`" exact>
      <template #prepend><v-icon icon="mdi-format-list-bulleted" /></template>
      <v-list-item-title>問題</v-list-item-title>
    </v-list-item>
    <v-list-group v-if="contest && contest.tasks && contest.tasks.length">
      <template #activator>
        <v-list-item>
          <template #prepend><v-icon icon="mdi-magnify" /></template>
          <v-list-item-title>（問題一覧）</v-list-item-title>
        </v-list-item>
      </template>
      <v-list-item
        v-for="task in contest.tasks"
        :key="task.slug"
        :to="`/contests/${contestName}/tasks/${task.slug}`"
        density="compact"
      >
        <v-list-item-title
          >{{ task.position }} [{{ task.difficulty }}]</v-list-item-title
        >
        <v-list-item-subtitle>{{ task.name }}</v-list-item-subtitle>
      </v-list-item>
    </v-list-group>
    <v-list-item :to="`/contests/${contestName}/clarifications`">
      <template #prepend><v-icon icon="mdi-help-circle" /></template>
      <v-list-item-title>質問</v-list-item-title>
      <template #prepend>
        <v-icon v-if="unreadClarifications" class="clarifications-unread">
          {{ unreadClarifications }}
        </v-icon>
      </template>
    </v-list-item>
    <v-list-item
      :to="`/contests/${contestName}/submits/all`"
      :disabled="!contest || (!afterContest && !contest.writtenTasks.length)"
    >
      <template #prepend><v-icon icon="mdi-list-status" /></template>
      <v-list-item-title>すべての提出</v-list-item-title>
    </v-list-item>
    <v-list-item :to="`/contests/${contestName}/submits`" exact>
      <template #prepend><v-icon icon="mdi-account-details" /></template>
      <v-list-item-title>自分の提出</v-list-item-title>
    </v-list-item>
    <v-list-item :to="`/contests/${contestName}/standings`">
      <template #prepend><v-icon icon="mdi-sort-variant" /></template>
      <v-list-item-title>順位表</v-list-item-title>
    </v-list-item>
    <v-list-item
      v-if="afterContest || (contest && contest.editorial)"
      :href="contest.editorial"
      :disabled="contest.editorial == null"
      target="_blank"
    >
      <template #prepend><v-icon icon="mdi-file-document-outline" /></template>
      <v-list-item-title>解説</v-list-item-title>
    </v-list-item>
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
