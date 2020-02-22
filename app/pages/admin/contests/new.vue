<template>
  <v-container fluid>
    <v-layout justify-center="">
      <v-flex xl6 lg8 md10>
        <h1 class="display-1 ma-2">コンテストの作成</h1>
        <new-contest-card
          class="my-2"
          @input-title="changeName"
          @input-slug="changeSlug"
        />
        <contest-admin-time-card is-new class="my-2" @change="onTimeChange" />
        <v-btn :disabled="disabled" block color="primary" large>
          コンテストを作成する
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import ContestAdminTimeCard from '~/components/ContestAdminTimeCard.vue'
import NewContestCard from '~/components/NewContestCard.vue'

@Component({
  components: { NewContestCard, ContestAdminTimeCard }
})
export default class PageNewContest extends Vue {
  name = ''
  slug = ''
  dateTimes: {
    startDate: Date | null
    startTime: Date | null
    endDate: Date | null
    endTime: Date | null
    ok: boolean
  } = {
    startDate: null,
    startTime: null,
    endDate: null,
    endTime: null,
    ok: false
  }

  get disabled() {
    return !(
      this.dateTimes.ok &&
      this.name &&
      /\S+/.test(this.slug) &&
      this.slug !== 'new'
    )
  }

  onTimeChange(
    sd: Date | null,
    st: Date | null,
    ed: Date | null,
    et: Date | null,
    ok: boolean
  ) {
    this.dateTimes.startDate = sd
    this.dateTimes.startTime = st
    this.dateTimes.endDate = ed
    this.dateTimes.endTime = et
    this.dateTimes.ok = ok
  }

  changeName(v: string) {
    this.name = v
  }

  changeSlug(v: string) {
    this.slug = v
  }
}
</script>

<style scoped>
.wrapper {
}
</style>
