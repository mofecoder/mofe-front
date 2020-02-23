<template>
  <div>
    <div v-if="contest">
      <ContestHeader :name="contest.name" />
      <v-container class="pa-0" fluid>
        <ContestHeaderTab />
        <v-card>
          <v-card-text style="color:inherit">
            <table class="problems">
              <thead>
                <tr>
                  <td class="row-position" />
                  <td class="row-difficulty">難易度</td>
                  <td class="row-name">問題名</td>
                </tr>
              </thead>
              <tbody>
                <tr v-for="problem in contest.tasks" :key="problem.slug">
                  <td>{{ problem.position }}</td>
                  <td>{{ problem.difficulty }}</td>
                  <td>
                    <n-link :to="`tasks/${problem.slug}`">{{
                      problem.name
                    }}</n-link>
                  </td>
                </tr>
              </tbody>
            </table>
          </v-card-text>
        </v-card>
      </v-container>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import ContestHeaderTab from '~/components/ContestHeaderTab.vue'
import ContestHeader from '~/components/ContestHeader.vue'
import { Contest } from '~/types/contest'

@Component({
  components: {
    ContestHeader,
    ContestHeaderTab
  }
})
export default class PageContestTasks extends Vue {
  contest: Contest | null = null

  async mounted() {
    this.contest = await this.$api.Contests.index(
      this.$route.params.contestName
    )
  }
}
</script>

<style scoped lang="scss">
.problems {
  border-collapse: collapse;
  text-align: center;
  font-size: 1.1rem;
  width: 100%;
  .row-position {
    width: 2em;
  }
  .row-difficulty {
    width: 7em;
  }
  table,
  td {
    border: #444444 solid 1px;
  }
  thead td {
    padding: 0.2em 0;
  }
  tbody td {
    padding: 0.6em 0;
  }
}
</style>
