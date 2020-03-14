<template>
  <div class="contest-sidebar">
    <div
      v-for="item in items"
      :key="item.name"
      class="contest-sidebar__item"
      :class="{ active: item.active, disabled: item.disabled }"
      @click="!item.disabled && $emit('click', item.path)"
      v-text="item.name"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

type ItemType = {
  name: string
  active: boolean
  disabled?: boolean
  path: string
}

@Component
export default class ContestSidebar extends Vue {
  @Prop({ required: true })
  items!: ItemType[]
}
</script>

<style scoped lang="scss">
.contest-sidebar__item {
  font-size: 0.8rem;
  box-sizing: border-box;
  padding: 0.9em 1em;
  &.active {
    background: #daeefc;
    color: #0c385f;
    border-right: 12px solid #237aff;
    border-radius: 2px;
  }
  &:not(.active):not(.disabled) {
    cursor: pointer;
    &:hover:not(.active) {
      background: #f0f0f0;
    }
  }
  &.disabled {
    background: #999999;
  }
}
</style>
