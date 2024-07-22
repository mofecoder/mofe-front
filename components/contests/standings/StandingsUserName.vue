<template>
  <div>
    <div v-if="user.teamMember" class="team">
      <v-tooltip :text="user.teamMember.join(', ')" location="bottom">
        <template #activator="{ props }">
          <v-btn
            color="primary"
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
import RatingColored from '~/components/RatingColored.vue'

defineProps<{
  user: Standing['user']
  showTeamMembers?: boolean
  submissions?: string | null
}>()

const atcoderColor = (rating: number | null) => {
  if (rating === null) return '#5200ab'
  if (rating === 0) return '#000000'
  switch (Math.floor(rating / 400)) {
    case 0:
      return '#808080'
    case 1:
      return '#804000'
    case 2:
      return '#008000'
    case 3:
      return '#00c0c0'
    case 4:
      return '#0000ff'
    case 5:
      return '#c0c000'
    case 6:
      return '#ff8000'
    default:
      return '#ff0000'
  }
}
</script>

<style lang="scss" scoped>
.team {
  span {
    color: blue;
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
