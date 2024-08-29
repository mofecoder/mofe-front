<script setup lang="ts">
import { useDisplay } from 'vuetify'
import { useUserStore } from '~/store/user'

const dayjs = useDayjs()

const title = 'MOFE'
const year = dayjs().year()
const links = [
  {
    title: 'ホーム',
    props: {
      prependIcon: 'mdi-home',
      rounded: 'xl',
      to: '/'
    }
  },
  {
    title: 'コンテスト一覧',
    props: {
      prependIcon: 'mdi-application-settings',
      rounded: 'xl',
      to: '/contests'
    }
  },
  {
    title: '記事一覧',
    props: {
      prependIcon: 'mdi-note-multiple',
      rounded: 'xl',
      to: '/posts'
    }
  }
]

const userStore = useUserStore()

const problemsLink = {
  title: '問題管理',
  props: {
    prependIcon: 'mdi-text-box-multiple-outline',
    rounded: 'xl',
    to: '/manage/problems'
  }
}

const admin = [
  {
    title: '管理メイン',
    props: {
      prependIcon: 'mdi-security',
      rounded: 'xl',
      to: '/admin'
    }
  },
  problemsLink,
  {
    title: 'コンテスト管理',
    props: {
      prependIcon: 'mdi-application-cog',
      rounded: 'xl',
      to: '/manage/contests'
    }
  },
  {
    title: 'ユーザ管理',
    props: {
      prependIcon: 'mdi-account-cog',
      rounded: 'xl',
      to: '/admin/users'
    }
  },
  {
    title: '記事管理',
    props: {
      prependIcon: 'mdi-note-edit',
      rounded: 'xl',
      to: '/admin/posts'
    }
  }
]

const role = computed(() => userStore.user?.role)
const display = useDisplay()
const drawer = ref(!display.mobile.value)
</script>

<template>
  <v-app>
    <nuxt-loading-indicator />
    <v-app-bar class="header" color="deep-orange-lighten-5">
      <template #prepend>
        <template v-if="$vuetify.display.mobile">
          <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer" />
        </template>
      </template>
      <template #title>
        {{ title }}
        <EnvironmentChip />
      </template>
      <template #append>
        <ToolbarUser />
      </template>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" color="deep-orange-lighten-5">
      <v-list rounded class="px-3 pt-6">
        <v-list-item
          v-for="item in links"
          :key="item.title"
          v-bind="item.props"
        >
          {{ item.title }}
        </v-list-item>
        <template v-if="role === 'writer'">
          <v-divider inset />
          <v-list-item v-bind="problemsLink.props">
            {{ problemsLink.title }}
          </v-list-item>
        </template>
        <template v-if="role === 'admin'">
          <v-list-subheader>管理画面</v-list-subheader>
          <v-list-item
            v-for="item in admin"
            :key="item.title"
            v-bind="item.props"
          >
            {{ item.title }}
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-main style="--v-layout-top: 64px">
      <v-container>
        <slot />
      </v-container>
    </v-main>
    <v-footer
      app
      class="d-flex flex-column justify-center bg-grey-lighten-3"
      absolute
    >
      <p class="mb-0 mr-3">Copyright 2020 - {{ year }} CafeCoder & MOFE</p>
      <NuxtLink to="/privacy_policy">プライバシーポリシー</NuxtLink>
    </v-footer>
  </v-app>
</template>

<style scoped lang="scss"></style>
