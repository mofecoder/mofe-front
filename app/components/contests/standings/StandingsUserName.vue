<template>
  <div>
    <div v-if="user.teamMember" class="team">
      <v-tooltip :text="user.teamMember.join(', ')" location="bottom">
        <template #activator="{ props }">
          <v-btn
            color="secondary"
            v-bind="props"
            icon="mdi-account-group"
            size="small"
            variant="text"
            density="compact"
          />
        </template>
      </v-tooltip>
      <span>{{ user.name }}</span>
      <div
        v-if="showTeamMembers"
        class="team-member"
        v-text="user.teamMember.join(', ')"
      />
    </div>
    <RatingColored
      v-else
      :atcoder-id="user.atcoderId"
      :rating="user.atcoderRating"
      :text="user.name"
    />
    <v-btn
      v-if="submissions && !user.teamMember"
      class="ms-1"
      icon="mdi-text-box-search"
      size="x-small"
      variant="text"
      density="compact"
      color="black"
      :to="{ path: submissions, query: { user: user.name } }"
    />
  </div>
</template>

<script setup lang="ts">
import type { Standing } from '~/types/standings'

defineProps<{
  user: Standing['user']
  showTeamMembers?: boolean
  submissions?: string | null
}>()
</script>

<style lang="scss" scoped>
.team {
  span {
    color: black;
    font-weight: bold;
    margin-left: 0.3em;
  }
}
.team-member {
  color: #606060;
  font-size: 0.7em;
  font-style: normal;
  font-weight: normal;
}
</style>
