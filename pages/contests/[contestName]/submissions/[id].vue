<script setup lang="ts">
import Contests from '~/utils/apis/Contests'
import TestcaseSetsTable from '~/components/contests/submissions/TestcaseSetsTable.vue'

definePageMeta({
  layout: 'contest',
  validate({ params }) {
    return typeof params.id === 'string' && /^[1-9]\d*$/.test(params.id)
  }
})

const route = useRoute()
const id = computed(() => parseInt(route.params.id as string))

const { contest, contestName } = useContest()

useHead(() => ({
  title: `提出 #${id.value} - ${contest.value?.name}`,
  titleTemplate: null
}))

const { data: submission, error } = await useApi(Contests.getSubmission, [
  contestName.value,
  id.value
])
const errorMessage = ref('')
const source = ref('')

if (error.value) {
  errorMessage.value = error.value?.data.error || ''
} else {
  source.value = submission.value!.source
}

const { $getLanguageName } = useNuxtApp()
const language = computed(() => {
  if (!submission.value) return null
  return $getLanguageName(submission.value.lang)
})

const autoHeight = ref(false)
const showCopiedMessage = ref(false)
const copySource = () => {
  copy(source.value)
  if (process.client) {
    showCopiedMessage.value = true
    setTimeout(() => {
      showCopiedMessage.value = false
    }, 2000)
  }
}

const showResults = computed(() => submission.value?.testcaseResults?.length)
const showSets = computed(() => submission.value?.testcaseSets != null)
</script>

<template>
  <v-card v-if="!errorMessage" :loading="!submission">
    <v-card-title v-if="submission">提出 #{{ submission.id }}</v-card-title>
    <v-card-text>
      <v-container v-if="submission">
        <v-row>
          <v-col cols="12" sm="5">
            <v-switch
              v-model="autoHeight"
              color="amber-darken-3"
              density="compact"
              label="高さを自動調節"
              hide-details
            />
          </v-col>
          <v-spacer />
          <v-col cols="12" sm="7" md="4" lg="3">
            <v-btn
              variant="outlined"
              :disabled="showCopiedMessage"
              block
              :prepend-icon="
                showCopiedMessage ? 'mdi-check' : 'mdi-content-copy'
              "
              @click="copySource"
              >{{
                showCopiedMessage ? 'コピーしました!' : 'ソースコードをコピー'
              }}</v-btn
            >
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <div v-show="submission">
              <CodeEditor
                :model-value="source"
                :language="language"
                :auto-height="autoHeight"
                read-only
              />
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            cols="12"
            :lg="showSets && !showResults ? 5 : 12"
            :xl="showResults || submission.compileError ? 3 : 12"
          >
            <v-table dense>
              <tbody>
                <tr>
                  <th>提出日時</th>
                  <td v-text="formatDate(submission.timestamp)" />
                </tr>
                <tr>
                  <th>問題</th>
                  <td>
                    <NuxtLink
                      :to="`/contests/${contest.slug}/tasks/${submission.task.slug}`"
                    >
                      {{ submission.task.position }}: {{ submission.task.name }}
                    </NuxtLink>
                  </td>
                </tr>
                <tr>
                  <th>ユーザ</th>
                  <td v-text="submission.user.name" />
                </tr>
                <tr>
                  <th>言語</th>
                  <td v-text="language.name" />
                </tr>
                <tr>
                  <th>得点</th>
                  <td v-text="submission.point" />
                </tr>
                <tr>
                  <th>結果</th>
                  <td>
                    <ContestsSubmissionsResultChip
                      :status="submission.status"
                      :judge-status="submission.judgeStatus"
                    />
                  </td>
                </tr>
                <tr v-if="submission.executionTime != null">
                  <th>実行時間</th>
                  <td>{{ submission.executionTime }} ms</td>
                </tr>
                <tr v-if="submission.executionMemory != null">
                  <th>メモリ</th>
                  <td>{{ submission.executionMemory || '---' }} KB</td>
                </tr>
              </tbody>
            </v-table>
          </v-col>
          <v-spacer />
          <v-col v-if="showSets" cols="12" lg="7" xl="5">
            <h4>セットごとの結果</h4>
            <TestcaseSetsTable :results="submission.testcaseSets" />
          </v-col>
          <v-col v-if="showResults" cols="12" lg="5" xl="4">
            <h4>ジャッジ結果</h4>
            <ContestsSubmissionsTestcaseResultsTable
              :testcase-results="submission.testcaseResults"
              :sample-count="submission.sampleCount"
            />
          </v-col>
          <v-col v-if="submission.compileError" cols="12" xl="8">
            <h3>コンパイルエラー</h3>
            <pre
              class="compile-error"
            ><code v-text="submission.compileError" /></pre>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
  <v-alert v-else type="error">
    {{ errorMessage }}
  </v-alert>
</template>

<style scoped lang="scss">
@use 'styles/markdown';
.compile-error code {
  @include markdown.block-code();
  font-size: 0.8em;
  line-height: 1.4;
}
</style>
