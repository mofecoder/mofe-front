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

const updateRating = async () => {
  await useApi(Admin.updateRating, [])
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
            variant="tonal"
            prepend-icon="mdi-autorenew"
            @click="updateRating"
          >
            レーティング更新
          </v-btn>
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
