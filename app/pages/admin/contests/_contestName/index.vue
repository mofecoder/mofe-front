<template>
  <v-container fluid>
    <v-layout justify-center>
      <v-flex xl6 lg8 md10>
        <contest-admin-problems-card class="my-4" />
        <contest-admin-time-card class="my-4" />
        <contest-admin-settings-card class="my-4" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import ContestAdminProblemsCard from '~/components/ContestAdminProblemsCard.vue'
import ContestAdminTimeCard from '~/components/ContestAdminTimeCard.vue'
import ContestAdminSettingsCard from '~/components/ContestAdminSettingsCard.vue'
@Component({
  components: {
    ContestAdminProblemsCard,
    ContestAdminTimeCard,
    ContestAdminSettingsCard
  }
})
export default class PageContestAdmin extends Vue {
  get contestName() {
    return this.$route.params.contestName
  }

  created() {
    // コンテストが存在するかを確認
    // this.$router.push('/error/404');
  }
}
</script>
