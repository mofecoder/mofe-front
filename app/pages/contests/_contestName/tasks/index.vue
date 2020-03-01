<template>
  <div>
    <template v-if="contest">
      <v-container class="pa-0" fluid>
        <v-card max-width="600px">
          <v-list rounded>
            <v-subheader>問題一覧</v-subheader>
            <v-list-item-group color="secondary">
              <v-list-item
                v-for="problem in contest.tasks"
                :key="problem.slug"
                :to="`/contests/${slug}/tasks/${problem.slug}`"
              >
                <v-list-item-icon class="position">{{
                  problem.position
                }}</v-list-item-icon>
                <v-list-item-content class="content">
                  <div>{{ problem.name }}</div>
                  <DifficultyChip :difficulty="problem.difficulty" />
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-container>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import ContestHeaderTab from '~/components/ContestHeaderTab.vue'
import ContestHeader from '~/components/ContestHeader.vue'
import { contestStore } from '~/utils/store-accessor'
import MixinContest from '~/mixins/contest'
import DifficultyChip from '~/components/parts/difficulty-chip.vue'

@Component({
  components: {
    DifficultyChip,
    ContestHeader,
    ContestHeaderTab
  },
  layout: 'contest'
})
export default class PageContestTasks extends mixins(MixinContest) {
  async created() {
    await contestStore.getContest(this.$route.params.contestName)
  }

  get slug(): string {
    return this.$route.params.contestName
  }
}
</script>

<style scoped lang="scss">
.position {
  display: inline-flex;
  background: #9544aa;
  color: #ffffff;
  width: 2rem;
  height: 2rem;
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
  flex: unset;
}
</style>
