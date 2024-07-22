<script setup lang="ts">
import Admin from '~/utils/apis/Admin'
import type { User } from '~/types/adminUser'
import { formatDate } from '~/utils/formatting'

definePageMeta({
  middleware: 'admin'
})

useHead({
  title: 'ユーザの管理'
})

const { data: users, refresh } = await useApi(Admin.getUsers, [])
const headers = [
  { title: 'ユーザ名', key: 'name' },
  { title: '権限', key: 'role' },
  { title: '登録日時', key: 'createdAt' },
  { title: '最終ログイン', key: 'signInDate' },
  { title: 'AtCoder ID', key: 'atcoder' },
  { title: 'writer リクエストコード', key: 'writerRequestCode' }
]

const items = computed(() =>
  users.value?.map((user) => ({
    ...user,
    createdAt: formatDate(user.createdAt),
    writerRequestCode: user.writerRequestCode || '未発行',
    signInDate: user.currentSignInAt && formatDate(user.currentSignInAt)
  }))
)

const update = async (userId: number, role: User['role']) => {
  await useApi(Admin.updateUser, [userId], {}, { role })
  await refresh()
}

const search = ref('')
</script>

<template>
  <div>
    <h2>ユーザの管理</h2>
    <v-text-field
      v-model="search"
      prepend-icon="mdi-magnify"
      label="検索"
      hide-details
    />
    <v-data-table :headers="headers" :items="items" :search="search">
      <template #item.role="{ item }">
        <template v-if="item.role === 'member'">
          member
          <v-btn
            size="small"
            density="compact"
            icon="mdi-arrow-up-circle"
            variant="text"
            @click="update(item.id, 'writer')"
          />
        </template>
        <template v-else-if="item.role === 'writer'">
          writer
          <v-btn
            size="small"
            density="compact"
            icon="mdi-arrow-down-circle"
            variant="text"
            @click="update(item.id, 'member')"
          />
        </template>
        <template v-else>{{ item.role }}</template>
      </template>
      <template #item.atcoder="{ item }">
        <RatingColored
          class="atcoder"
          :atcoder-id="item.atcoderId"
          :rating="item.atcoderRating"
          :text="item.atcoderId"
        />
      </template>
    </v-data-table>
  </div>
</template>

<style scoped lang="scss">
.atcoder {
  font-weight: bold;
  text-decoration: none;
}
</style>
