<template>
  <v-app>
    <v-app-bar :clipped-left="true" fixed app>
      <n-link to="/" style="color:inherit;text-decoration:inherit;">
        <v-toolbar-title v-text="title" />
      </n-link>
    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class LayoutDefault extends Vue {
  title = 'CafeCoder'
}
</script>
