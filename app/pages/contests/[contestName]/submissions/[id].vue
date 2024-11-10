<script setup lang="ts">
import { useDisplay } from 'vuetify'
import Contests from '~/utils/apis/Contests'

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

const {
  data: submission,
  error,
  status,
  refresh
} = await useApi(Contests.getSubmission, [contestName.value!, id.value])
const errorMessage = ref('')
const source = ref('')

const isWaitingJudge = computed(
  () =>
    submission.value != null &&
    (['WJ', 'WR', 'CP'].includes(submission.value.status) ||
      submission.value.judgeStatus != null)
)

const { pause, resume } = useIntervalFn(async () => await refresh(), 2000)

watch(
  isWaitingJudge,
  () => {
    if (isWaitingJudge.value) resume()
    else pause()
  },
  { immediate: true }
)

if (error.value) {
  errorMessage.value = error.value?.data.error || ''
} else {
  source.value = submission.value!.source
}

const { $getLanguageName } = useNuxtApp()
const language = computed(() => {
  if (!submission.value) return undefined
  return $getLanguageName(submission.value.lang)
})

const autoHeight = ref(false)
const showCopiedMessage = ref(false)
const copySource = () => {
  copy(source.value)
  if (import.meta.client) {
    showCopiedMessage.value = true
    useTimeoutFn(() => {
      showCopiedMessage.value = false
    }, 2000)
  }
}

const showResults = computed(() => submission.value?.testcaseResults?.length)
const showSets = computed(() => submission.value?.testcaseSets != null)

const display = useDisplay()

const togglePublished = async () => {
  await api(Contests.togglePublishStatus, [contestName.value!, id.value])
    .then(async () => await refresh())
    .catch(() => {
      alert('公開状態の切り替えに失敗しました')
    })
}
</script>

<template>
  <v-card v-if="contest && !errorMessage" :loading="status === 'pending'">
    <v-card-title v-if="submission">提出 #{{ submission.id }}</v-card-title>
    <v-card-text>
      <v-container v-if="submission">
        <v-alert
          v-if="submission.permission && !submission.public"
          variant="tonal"
          type="warning"
          title="この提出は非公開設定です。"
          class="mb-4"
        >
          非公開設定にすると、「コンテスト管理者」と「該当問題の
          writer」以外は「すべての提出」に表示されなくなります。<br />
          提出したユーザは非公開設定の影響を受けません。tester
          は直接リンクから閲覧可能です。
        </v-alert>
        <v-row>
          <v-col cols="12" sm="4">
            <v-switch
              v-model="autoHeight"
              color="amber-darken-3"
              density="compact"
              label="高さを自動調節"
              hide-details
            />
          </v-col>
          <v-spacer />
          <v-col v-if="submission.permission" cols="12" sm="4" md="3" lg="3">
            <v-btn block variant="tonal" color="red" @click="togglePublished">
              提出を{{ submission.public ? '非公開' : '公開' }}にする
            </v-btn>
          </v-col>
          <v-col cols="12" sm="4" md="4" lg="3">
            <v-btn
              variant="outlined"
              :disabled="showCopiedMessage"
              block
              :prepend-icon="
                showCopiedMessage ? 'mdi-check' : 'mdi-content-copy'
              "
              @click="copySource"
              >{{
                showCopiedMessage
                  ? 'コピーしました!'
                  : display.mdAndUp.value
                    ? 'ソースコードをコピー'
                    : 'コピー'
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
            <v-table density="comfortable">
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
                  <td v-text="language?.name" />
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
          <v-col v-if="showSets" cols="12" lg="5" xl="4">
            <h4>セットごとの結果</h4>
            <ContestsSubmissionsTestcaseSetsTable
              :results="submission.testcaseSets"
            />
          </v-col>
          <v-col v-if="showResults" cols="12" lg="7" xl="5">
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
@use '@/styles/variables';

.compile-error code {
  @include variables.block-code();

  font-size: 0.8em;
  line-height: 1.4;
}
</style>
