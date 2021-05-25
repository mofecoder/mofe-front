<template>
  <div>
    <h2>ユーザの管理</h2>
    <v-data-table :headers="headers" :items="items">
      <template #item.role="{ item }">
        <template v-if="item.role === 'member'"
          >member
          <v-icon small @click="update(item.id, 'writer')"
            >mdi-arrow-up-circle</v-icon
          ></template
        >
        <template v-else-if="item.role === 'writer'"
          >writer
          <v-icon small @click="update(item.id, 'member')"
            >mdi-arrow-down-circle</v-icon
          ></template
        >
        <template v-else>{{ item.role }}</template>
      </template>
      <template #item.writerRequestCode="{ item }">
        {{ item.writerRequestCode || '未発行' }}
        <v-icon small @click="generate(item.id)">mdi-refresh</v-icon>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { DataTableHeader } from 'vuetify'
import dayjs from 'dayjs'
import { User } from '~/types/adminUser'

@Component({
  middleware: 'admin',
  head: { title: 'パスワードのリセット' }
})
export default class PageManageIndex extends Vue {
  users: User[] | null = null
  headers = [
    { text: 'ユーザ名', value: 'name' },
    { text: '権限', value: 'role' },
    { text: '登録日時', value: 'createdAt' },
    { text: 'writer リクエストコード', value: 'writerRequestCode' }
  ] as DataTableHeader[]

  async fetch() {
    this.users = await this.$api.Users.index()
  }

  get items() {
    return (
      this.users?.map((user) => ({
        id: user.id,
        name: user.name,
        role: user.role,
        createdAt: dayjs(user.createdAt).format('YYYY/MM/DD'),
        writerRequestCode: user.writerRequestCode
      })) || []
    )
  }

  update(userId: number, role: User['role']) {
    this.$api.Users.update(userId, { role }).then(this.$fetch)
  }

  generate(userId: number) {
    this.$api.Users.generateWriterRequestCode(userId).then(this.$fetch)
  }
}
</script>
