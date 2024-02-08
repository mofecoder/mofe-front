<script setup lang="ts">
import type { Difficulty } from '~/types/task'

const props = defineProps<{
  difficulty: Difficulty
}>()

const difficulties: {
  difficulty: Difficulty
  color: string
  class?: string
}[] = [
  {
    difficulty: 'Milk',
    color: 'grey-darken-1'
  },
  {
    difficulty: 'Assam',
    color: 'brown-darken-1',
    class: 'white--text'
  },
  {
    difficulty: 'Benihuki',
    color: 'green-darken-2',
    class: 'white--text'
  },
  {
    difficulty: 'Ceylon',
    color: 'light-blue-lighten-3'
  },
  {
    difficulty: 'Darjeeling',
    color: 'indigo-darken-3',
    class: 'white--text'
  },
  {
    difficulty: 'Earlgray',
    color: 'yellow-darken-1'
  },
  {
    difficulty: 'Flavor',
    color: 'deep-orange-darken-1'
  },
  {
    difficulty: 'ผักชี',
    color: 'red-darken-2',
    class: 'white--text'
  }
]

const item = difficulties.find((x) => x.difficulty === props.difficulty)!
</script>
<template>
  <v-chip :color="item.color" class="chip" :class="item.class">{{
    item.difficulty
  }}</v-chip>
</template>

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
