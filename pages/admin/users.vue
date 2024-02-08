<script setup lang="ts">
import Admin from '~/utils/apis/Admin'
import type { User } from '~/types/adminUser'
import { VDataTable } from 'vuetify/labs/components'
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
  { title: 'writer リクエストコード', key: 'writerRequestCode' }
]

const items = computed(() =>
  users.value?.map((user) => ({
    id: user.id,
    name: user.name,
    role: user.role,
    createdAt: formatDate(user.createdAt),
    writerRequestCode: user.writerRequestCode
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
      <template #item.role="{ item: { columns: item, index } }">
        <template v-if="item.role === 'member'">
          member
          <v-btn
            size="small"
            density="compact"
            icon
            variant="text"
            @click="update(items[index].id, 'writer')"
          >
            <v-icon>mdi-arrow-up-circle</v-icon>
          </v-btn>
        </template>
        <template v-else-if="item.role === 'writer'">
          writer
          <v-btn
            size="small"
            density="compact"
            icon
            variant="text"
            @click="update(items[index].id, 'member')"
          >
            <v-icon>mdi-arrow-down-circle</v-icon>
          </v-btn>
        </template>
        <template v-else>{{ item.role }}</template>
      </template>
      <template #item.writerRequestCode="{ item: { columns: item } }">
        {{ item.writerRequestCode || '未発行' }}
      </template>
    </v-data-table>
  </div>
</template>

<style scoped lang="scss"></style>
