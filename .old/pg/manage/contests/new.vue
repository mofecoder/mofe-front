<template>
  <v-container fluid>
    <v-layout justify-center="">
      <v-flex xl6 lg8 md10>
        <h1 class="text-h4 ma-2">コンテストの作成</h1>
        <ContestInformationCard
          v-model:name="name"
          v-model:slug="slug"
          v-model:description="description"
          v-model:penalty="penalty"
          v-model:kind="kind"
          class="my-2"
        />
        <TimeCard is-new class="my-2" @change="onTimeChange" />
        <v-btn
          :disabled="disabled"
          block
          color="primary"
          size="large"
          @click="submit"
        >
          コンテストを作成する
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import dayjs from 'dayjs'
import TimeCard from '../../../comp/contestAdmin/TimeCard.vue'
import ContestInformationCard from '../../../comp/contestAdmin/InformationCard.vue'
import { Contest } from '~/types/contest'

@Component({
  components: { ContestInformationCard, TimeCard },
  middleware: 'authenticated',
  head: { title: 'コンテストの作成' }
})
export default class PageNewContest extends Vue {
  name = ''
  slug = ''
  description = ''
  penalty = '0'
  kind: Contest['kind'] = 'normal'
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

  async submit() {
    const start = dayjs(
      this.dateTimes.startDate + ' ' + this.dateTimes.startTime
    )
    const end = dayjs(this.dateTimes.endDate + ' ' + this.dateTimes.endTime)
    await this.$api.Contests.create({
      name: this.name,
      slug: this.slug,
      kind: this.kind,
      startAt: start.format(),
      endAt: end.format(),
      description: this.description,
      penaltyTime: parseInt(this.penalty) * 60
    }).then(() => {
      this.$router.push(`/manage/contests/${this.slug}`)
    })
  }
}
</script>

<style scoped></style>
