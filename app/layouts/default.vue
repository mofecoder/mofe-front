<template>
  <v-app>
    <v-app-bar :clipped-left="true" fixed app>
      <v-toolbar-title v-text="title" />
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
