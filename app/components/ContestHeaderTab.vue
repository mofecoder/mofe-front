<template>
  <div>
    <div class="wrap">
      <a class="tab" :class="active('index')" @click="go('')">トップ</a>
      <div class="tab" :class="active('tasks')" @click="go('tasks')">問題</div>
      <div class="tab submit" @click="switchSubmit">
        提出一覧<span class="triangle">▼</span>
        <div v-show="showSubmits" class="submits">
          <div class="tab">自分の提出</div>
          <div class="tab">みんなの提出</div>
        </div>
      </div>
      <a class="tab" :class="active('standings')" @click="go('standings')">
        順位表
      </a>
      <div class="tab tab--disabled">解説</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
@Component
export default class ContestHeaderTab extends Vue {
  showSubmits: boolean = false
  switchSubmit() {
    this.showSubmits = !this.showSubmits
  }

  get current(): string {
    const path = this.$route.fullPath
    const regex = /contests\/\w+\/?(\w+)?\/?(\?.+)?$/.exec(path)
    if (!regex) return ''
    return regex[1] || 'index'
  }

  active(s: string) {
    return s !== this.current ? [] : ['tab--active']
  }

  go(path: string) {
    const slug = this.$route.params.contestName
    this.$router.push(`/contests/${slug}/${path}`)
  }
}
</script>

<style lang="scss" scoped>
.wrap {
  display: flex;
  flex-wrap: wrap;
  justify-content: left;
  max-width: 100%;
  width: calc(170px * 5);
}
.tab {
  user-select: none;
  background-color: #efefef;
  width: 150px;
  padding: 0.4em 0;
  margin: 0.5rem 10px 0.5rem 0;
  text-align: center;
  box-sizing: border-box;
  color: inherit;
  &.submit {
    position: relative;
  }
  &--active {
    background-color: #b9ffff;
  }
  &:not(&--active) {
    cursor: pointer;
  }
  &--disabled {
    cursor: not-allowed !important;
    background-color: #898989;
    color: #e2e2e2;
  }
}
.submits {
  display: flex;
  flex-flow: column;
  justify-content: space-around;
  position: absolute;
  left: -5px;
  top: 2.5em;
  width: 160px;
  height: 84px;
  z-index: 1;
  margin-top: 3px;
  background-color: rgba(255, 255, 255, 0.8);
  .tab {
    margin: 0 5px;
    background: #e2e2e2;
  }
}
.triangle {
  font-size: 0.7em;
  margin-left: 0.3em;
}
</style>
