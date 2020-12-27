<template>
  <v-app>
    <v-sheet
      app
      flat
      tile
      width="100%"
      min-height="4rem"
      height="auto"
      color="green darken-4"
      class="white--text pl-8 contest-header"
    >
      <v-app-bar-nav-icon
        class="d-md-none contest-header__nav-icon"
        @click.stop="drawer = !drawer"
      />
      <template v-if="contest">
        <n-link class="contest-header__contest-name-link" to="/">
          {{ contest.name }}
        </n-link>
        <div class="contest-header__info">
          <div class="contest-header__info__title">コンテスト日時</div>
          <div v-for="text in contestTime" :key="text" v-text="text" />
        </div>
      </template>
      <v-spacer />
      <template v-if="user">
        <n-link class="contest-header__user-name pr-8 white--text" to="/user"
          >{{ user.name }}
        </n-link>
      </template>
      <template v-else>
        <v-btn class="white--text" to="/sign_up" text>新規登録</v-btn>
        <v-btn class="white--text" to="/login" text>ログイン</v-btn>
      </template>
    </v-sheet>
    <v-navigation-drawer
      v-model="drawer"
      class="mt-16"
      app
      mobile-breakpoint="960"
    >
      <ContestSidebar :items="filteredLinks" @click="navigation" />
    </v-navigation-drawer>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator'
import dayjs from 'dayjs'
import { contestStore, userStore } from '~/utils/store-accessor'
import ContestSidebar from '~/components/ContestSidebar.vue'
import { ContestDetail } from '~/types/contest'
import 'dayjs/locale/ja'

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

  get links(): Link[] {
    const contestEnded =
      this.contest != null && dayjs(this.contest.endAt).isBefore(Date())
    return [
      {
        name: 'トップ',
        path: ''
      },
      {
        name: '問題',
        path: 'tasks'
      },
      {
        name: '質問',
        path: 'clarifications'
      },
      {
        name: 'すべての提出',
        path: 'submits/all',
        disabled: !contestEnded && !this.contest?.isWriterOrTester
      },
      {
        name: '自分の提出',
        path: 'submits'
      },
      {
        name: '順位表',
        path: 'standings'
      }
      // {
      //   name: '解説',
      //   path: 'explanation',
      //   disabled: true
      // }
    ]
  }

  get contest(): ContestDetail | null {
    return contestStore.contest
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

  get contestTime(): string[] {
    dayjs.locale('ja')

    const start = dayjs(contestStore.contest!.startAt)
    const end = dayjs(contestStore.contest!.endAt)

    if (start.isSame(end, 'day')) {
      return [
        start.format('YYYY/MM/DD (dd) HH:mm') + ' - ' + end.format('HH:mm')
      ]
    } else {
      return [
        start.format('YYYY/MM/DD (dd) HH:mm') + ' - ',
        end.format('YYYY/MM/DD (dd) HH:mm')
      ]
    }
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
.contest-header {
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  flex-wrap: wrap;
  z-index: 9999;

  &__nav-icon {
    color: white !important;
    margin-right: 1.5em;
  }

  &__contest-name-link {
    color: inherit !important;
    text-decoration: inherit !important;
  }

  &__user-name {
    color: white;
    font-size: 1.2rem;
    align-self: center;
    text-decoration: none;
  }

  &__info {
    margin-left: 2rem;
    font-size: 0.9rem;
    color: #eaeaea;

    &__title {
      font-size: 0.7rem;
    }
  }
}
</style>
