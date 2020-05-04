<template>
  <v-card flat>
    <v-chip
      v-for="item in diffs"
      :key="item.difficulty"
      :color="item.color"
      label
      class="chip"
      :class="item.class"
      v-text="item.difficulty"
    />
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { Difficulty } from '~/types/task'

@Component
export default class UiTest extends Vue {
  diffs: { difficulty: Difficulty; color: string; class?: string }[] = [
    {
      difficulty: 'Milk',
      color: 'grey lighten-2'
    },
    {
      difficulty: 'Assam',
      color: 'brown darken-1',
      class: 'white--text'
    },
    {
      difficulty: 'Benihuki',
      color: 'green darken-2',
      class: 'white--text'
    },
    {
      difficulty: 'Ceylon',
      color: 'light-blue lighten-3'
    },
    {
      difficulty: 'Darjeeling',
      color: 'indigo darken-3',
      class: 'white--text'
    },
    {
      difficulty: 'Earlgray',
      color: 'yellow lighten-1'
    },
    {
      difficulty: 'Flavor',
      color: 'orange darken-3'
    },
    {
      difficulty: 'ผักชี',
      color: 'red darken-1',
      class: 'white--text'
    }
  ]
}
</script>

<style lang="scss" scoped>
.chip {
  display: inline-flex;
  margin: 1em;
  width: 6.5em;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  &::before {
    content: none;
  }
}
</style>
