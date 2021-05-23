<template>
  <v-list nav>
    <v-list-item-group color="primary">
      <v-list-item :to="`/contests/${contestName}`" exact>
        <v-list-item-icon><v-icon>mdi-home</v-icon></v-list-item-icon>
        <v-list-item-title>トップ</v-list-item-title>
      </v-list-item>
      <v-list-item :to="`/contests/${contestName}/tasks`" exact>
        <v-list-item-icon>
          <v-icon>mdi-format-list-bulleted</v-icon>
        </v-list-item-icon>
        <v-list-item-title>問題</v-list-item-title>
      </v-list-item>
      <v-list-group v-if="contest && contest.tasks && contest.tasks.length">
        <template v-slot:activator>
          <v-list-item-icon>
            <v-icon>mdi-magnify</v-icon>
          </v-list-item-icon>
          <v-list-item-title>（問題一覧）</v-list-item-title>
        </template>
        <v-list-item
          v-for="task in contest.tasks"
          :key="task.slug"
          :to="`/contests/${contestName}/tasks/${task.slug}`"
          dense
        >
          <v-list-item-title
            >{{ task.position }} [{{ task.difficulty }}]</v-list-item-title
          >
          <v-list-item-subtitle>{{ task.name }}</v-list-item-subtitle>
        </v-list-item>
      </v-list-group>
      <v-list-item :to="`/contests/${contestName}/clarifications`">
        <v-list-item-icon>
          <v-icon>mdi-help-circle</v-icon>
        </v-list-item-icon>
        <v-list-item-title>質問</v-list-item-title>
        <v-list-item-icon
          v-if="unreadClarifications"
          class="clarifications-unread"
        >
          {{ unreadClarifications }}
        </v-list-item-icon>
      </v-list-item>
      <v-list-item
        :to="`/contests/${contestName}/submits/all`"
        :disabled="!contest || (!afterContest && !contest.writtenTasks.length)"
      >
        <v-list-item-icon>
          <v-icon>mdi-list-status</v-icon>
        </v-list-item-icon>
        <v-list-item-title>すべての提出</v-list-item-title>
      </v-list-item>
      <v-list-item :to="`/contests/${contestName}/submits`" exact>
        <v-list-item-icon>
          <v-icon>mdi-account-details</v-icon>
        </v-list-item-icon>
        <v-list-item-title>自分の提出</v-list-item-title>
      </v-list-item>
      <v-list-item :to="`/contests/${contestName}/standings`">
        <v-list-item-icon>
          <v-icon>mdi-sort-variant</v-icon>
        </v-list-item-icon>
        <v-list-item-title>順位表</v-list-item-title>
      </v-list-item>
      <v-list-item
        v-if="afterContest || (contest && contest.editorial)"
        :href="contest.editorial"
        :disabled="contest.editorial == null"
        target="_blank"
      >
        <v-list-item-icon>
          <v-icon>mdi-file-document-outline</v-icon>
        </v-list-item-icon>
        <v-list-item-title>解説</v-list-item-title>
      </v-list-item>
    </v-list-item-group>
  </v-list>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import dayjs from 'dayjs'
import { ContestDetail } from '~/types/contest'

type ItemType = {
  name: string
  active: boolean
  disabled?: boolean
  path: string
}

@Component
export default class ContestSidebar extends Vue {
  @Prop({ required: true })
  contest!: ContestDetail | null

  @Prop({ required: true }) contestName!: string

  @Prop({ default: 0 })
  unreadClarifications!: number

  get afterContest() {
    return this.contest && dayjs(this.contest.endAt).isBefore(Date())
  }
}
</script>

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
