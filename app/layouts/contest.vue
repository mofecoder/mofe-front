<template>
  <v-app>
    <v-sheet
      app
      flat
      tile
      height="2.5em"
      color="green darken-4"
      class="white--text pl-8"
      style="font-size:1.5em;display:flex;align-items:center"
    >
      <v-app-bar-nav-icon
        class="d-md-none"
        style="color:white;margin-right:1.5em"
        @click.stop="drawer = !drawer"
      />
      <n-link to="/" style="color:inherit;text-decoration:inherit">
        {{ title }}
      </n-link>
    </v-sheet>
    <v-navigation-drawer
      v-model="drawer"
      app
      mobile-break-point="960"
      style="margin-top:60px"
    >
      <v-list dense>
        <v-list-item-group color="primary">
          <v-list-item
            v-for="item in links"
            :key="item.path"
            link
            :disabled="item.disabled"
            :class="{ 'v-list-item--active': item.path === current }"
          >
            <v-list-item-content @click="navigation(item.path)">
              <v-list-item-title v-text="item.name" />
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
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
import { contestStore } from '~/utils/store-accessor'

type Link = {
  path: string
  name: string
  disabled?: boolean
}

@Component
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
    const regex = /contests\/\w+\/((\w*)[\w/]*?)\/?(?:\?.+)?$/.exec(path)
    if (!regex) return null
    return regex[1]
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
