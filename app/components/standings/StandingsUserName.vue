<template>
  <a
    v-if="user.atcoderId"
    :href="`https://atcoder.jp/users/${user.atcoderId}`"
    target="_blank"
    :style="{ color: atcoderColor(user.atcoderRating) }"
    v-text="user.name"
  />
  <span v-else>{{ user.name }}</span>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { Standing } from '~/types/standings'

@Component
export default class StandingsUserName extends Vue {
  @Prop({ required: true })
  user: Standing['user']

  atcoderColor(rating: number | null) {
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
}
</script>
