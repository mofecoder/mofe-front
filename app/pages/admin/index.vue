<script setup lang="ts">
import ManageContests from '~/utils/apis/ManageContests'
import ManageProblems from '~/utils/apis/ManageProblems'
import Admin from '~/utils/apis/Admin'

definePageMeta({
  middleware: 'admin',
  layout: 'top'
})

useHead({
  title: '管理画面'
})

const { data: contests } = await useApi(ManageContests.getContests, [])
const { data: problems } = await useApi(ManageProblems.getUnsetProblems, [])
const status = ref<[number, number] | null>(null)

const updateRating = async () => {
  const response = await api(Admin.updateRating, [], {
    responseType: 'stream'
  })

  const reader = response.pipeThrough(new TextDecoderStream()).getReader()

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { value, done } = await reader.read()

    if (done) break
    status.value = value.split(',').map(Number) as [number, number]
    console.log(value)
  }
}
</script>

<template>
  <v-card :loading="!(contests && problems)">
    <v-container>
      <v-row>
        <v-col>
          <v-btn
            to="/manage/contests"
            variant="tonal"
            prepend-icon="mdi-application-cog"
            color="primary"
            block
          >
            コンテスト管理画面へ
          </v-btn>
          <v-btn
            class="mt-2"
            to="/admin/posts"
            color="primary"
            block
            variant="tonal"
            prepend-icon="mdi-note-edit"
          >
            記事管理画面へ
          </v-btn>
          <v-btn
            class="mt-2"
            to="/admin/users"
            color="primary"
            block
            variant="tonal"
            prepend-icon="mdi-account-cog"
            >ユーザ管理画面へ</v-btn
          >
          <v-btn
            color="orange"
            class="mt-4"
            block
            variant="tonal"
            prepend-icon="mdi-autorenew"
            :disabled="status != null && status[0] < status[1]"
            @click="updateRating"
          >
            レーティング更新
          </v-btn>
          <v-progress-linear v-if="status" :model-value="status[0] / status[1]"
            >{{ status[0] }} / {{ status[1] }}</v-progress-linear
          >
        </v-col>
        <v-col>
          <h2>問題（未所属）</h2>
          <p>問題数：{{ problems?.length }}</p>
          <ul v-if="problems && problems.length">
            <li v-for="problem in problems" :key="problem.id">
              <NuxtLink :to="`/manage/problems/${problem.id}`">
                {{ problem.name }} ({{ problem.difficulty }}) by
                {{ problem.writerUser }}
              </NuxtLink>
            </li>
          </ul>
          <p v-else-if="problems != null">該当なし</p>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<style scoped lang="scss"></style>
