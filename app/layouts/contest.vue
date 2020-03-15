<template>
  <v-app>
    <v-sheet
      app
      flat
      tile
      width="100%"
      height="4rem"
      color="green darken-4"
      class="white--text pl-8 header"
    >
      <v-app-bar-nav-icon
        class="d-md-none"
        style="color:white;margin-right:1.5em"
        @click.stop="drawer = !drawer"
      />
      <n-link to="/" style="color:inherit;text-decoration:inherit">
        {{ title }}
      </n-link>
      <v-spacer />
      <template v-if="user">
        <n-link
          class="header__user-name pr-8 white--text"
          style="text-decoration:none"
          to="/user"
          >{{ user.name }}</n-link
        >
      </template>
      <template v-else>
        <v-btn class="white--text" to="/sign_up" text>新規登録</v-btn>
        <v-btn class="white--text" to="/login" text>ログイン</v-btn>
      </template>
    </v-sheet>
    <v-navigation-drawer
      v-model="drawer"
      app
      mobile-break-point="960"
      style="margin-top:64px"
    >
      <ContestSidebar :items="filteredLinks" @click="navigation" />
    </v-navigation-drawer>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator'
import { contestStore, userStore } from '~/utils/store-accessor'
import ContestSidebar from '~/components/ContestSidebar.vue'

type Link = {
  path: string
  name: string
  disabled?: boolean
}

type ItemType = {
  path: string
  name: string
  active: boolean
  disabled?: boolean
}
@Component({
  components: { ContestSidebar }
})
export default class LayoutContest extends Vue {
  currentIndex: number | null = null
  drawer: boolean | null = null

  links: Link[] = [
    {
      name: 'トップ',
      path: ''
    },
    {
      name: '問題',
      path: 'tasks'
    },
    {
      name: 'すべての提出',
      path: 'submits/all'
    },
    {
      name: '自分の提出',
      path: 'submits'
    },
    {
      name: '順位表',
      path: 'standings'
    },
    {
      name: '解説',
      path: 'explanation',
      disabled: true
    }
  ]

  get title(): string {
    return contestStore.contest?.name || ''
  }

  created() {
    this.currentIndex = this.getCurrentIndex()
  }

  get current(): string | null {
    const path = this.$route.fullPath
    const regex = /contests\/\w+(?:\/((\w*)[\w/]*?)\/?(?:\?.+)?)?$/.exec(path)
    if (!regex) return null
    return regex[1] || ''
  }

  get user() {
    return userStore.getUser
  }

  get filteredLinks() {
    return this.links.map((x) => {
      const ret: ItemType = {
        path: x.path,
        name: x.name,
        active: x.path === this.current,
        disabled: x.disabled
      }
      return ret
    })
  }

  getCurrentIndex(): number | null {
    const current = this.current
    if (current == null) return null
    for (let i = 0; i < this.links.length; ++i)
      if (this.links[i].path === current) return i
    return null
  }

  navigation(path: string) {
    const slug = this.$route.params.contestName
    this.$router.push(`/contests/${slug}/${path}`)
  }

  @Watch('$route.fullPath')
  change() {
    this.currentIndex = this.getCurrentIndex()
  }
}
</script>

<style lang="scss">
.header {
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 9999;
  &__user-name {
    color: white;
    font-size: 1.2rem;
    align-self: center;
  }
}
</style>
