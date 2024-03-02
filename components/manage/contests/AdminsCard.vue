<script setup lang="ts">
defineProps<{
  loading?: boolean
  users: string[]
  error?: string
}>()

defineEmits<{
  add: [user: string]
  remove: [user: string]
}>()
</script>

<template>
  <v-card :loading="loading">
    <v-card-title>コンテスト管理者</v-card-title>
    <v-card-text>
      <ManageUserList
        :users="users"
        placeholder="管理者を追加"
        :loading="loading"
        :error="error"
        @add="(u) => $emit('add', u)"
        @remove="(u) => $emit('remove', u)"
      >
        <template #emptyMessage>
          コンテスト管理者は設定されていません。
        </template>
        <template #subheader>Contest Admins</template>
      </ManageUserList>
    </v-card-text>
  </v-card>
</template>

<style scoped lang="scss"></style>
