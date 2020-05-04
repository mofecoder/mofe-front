<template>
  <v-chip
    :color="item.color"
    label
    class="chip"
    :class="item.class"
    tag="div"
    v-text="item.difficulty"
  />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { Difficulty } from '~/types/task'

@Component
export default class UiTest extends Vue {
  @Prop({ required: true })
  difficulty!: Difficulty

  get item() {
    return this.diffs.find((x) => x.difficulty === this.difficulty)
  }

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
  display: flex;
  width: 6.5em;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  &::before {
    content: none;
  }
}
</style>
