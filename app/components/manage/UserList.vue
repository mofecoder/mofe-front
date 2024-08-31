<script setup lang="ts">
defineSlots<{
  subheader(props: {}): any
  emptyMessage(props: {}): any
}>()
withDefaults(
  defineProps<{
    placeholder?: string
    loading?: boolean
    error?: string
    users: string[]
  }>(),
  {
    placeholder: 'ユーザ名',
    error: ''
  }
)

const emits = defineEmits<{
  add: [user: string]
  remove: [user: string]
}>()
const adding = ref<string>('')

const add = () => {
  emits('add', adding.value)
  adding.value = ''
}
</script>

<template>
  <div>
    <v-list density="compact">
      <v-list-subheader>
        <slot name="subheader" />
      </v-list-subheader>
      <template v-if="users?.length">
        <v-list-item v-for="user in users" :key="user">
          {{ user }}
          <template #prepend>
            <v-list-item-action start>
              <v-btn
                icon="mdi-close"
                density="compact"
                size="small"
                variant="text"
                @click="$emit('remove', user)"
              />
            </v-list-item-action>
          </template>
        </v-list-item>
      </template>
      <v-list-item v-else disabled>
        <slot name="emptyMessage" />
      </v-list-item>
    </v-list>
    <div class="d-flex mt-1">
      <v-responsive max-width="200">
        <v-text-field
          v-model="adding"
          class="me-2"
          clearable
          :placeholder="placeholder"
          :loading="loading"
          density="compact"
          :error="!!error"
          :error-messages="error ? [error] : undefined"
          @keydown.enter="add"
        />
      </v-responsive>
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        variant="tonal"
        :loading="loading"
        :disabled="!adding"
        @click="add"
        >追加</v-btn
      >
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
