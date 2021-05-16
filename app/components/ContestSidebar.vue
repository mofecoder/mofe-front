<template>
  <div class="contest-sidebar">
    <component
      :is="
        item.disabled
          ? 'span'
          : item.path.startsWith('http')
          ? 'a'
          : 'router-link'
      "
      v-for="item in items"
      :key="item.name"
      class="contest-sidebar__item"
      :class="[
        `contest-sidebar__item--${item.path.split('/')[0]}`,
        {
          active: item.active,
          disabled: item.disabled
        }
      ]"
      :to="`/contests/${contestName}/${item.path}`"
      :href="item.path"
      :target="item.path.startsWith('http') ? '_blank' : null"
      :data-unread="unreadAttr(item)"
    >
      {{ item.name }}
    </component>
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

  @Prop({ required: true }) contestName!: string

  @Prop({ default: 0 })
  unreadClarifications!: number

  unreadAttr(item: ItemType) {
    return item.name === '質問' && this.unreadClarifications
      ? this.unreadClarifications
      : null
  }
}
</script>

<style scoped lang="scss">
.contest-sidebar__item {
  display: block;
  color: inherit;
  text-decoration: inherit;
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

  &--clarifications:after {
    display: inline-block;
    content: attr(data-unread);
    background: mediumblue;
    color: white;
    border-radius: 8px;
    width: 2em;
    text-align: center;
    margin-left: 0.4em;
  }
}
</style>
