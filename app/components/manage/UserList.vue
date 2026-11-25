<script setup lang="ts">
defineSlots<{
  subheader(): unknown
  emptyMessage(): unknown
}>()
const props = withDefaults(
  defineProps<{
    placeholder?: string
    loading?: boolean
    error?: string | string[]
    users: string[]
    // true のとき、複数ユーザ名のペーストで一括追加する
    bulk?: boolean
  }>(),
  {
    placeholder: 'ユーザ名',
    error: '',
    bulk: false
  }
)

const emits = defineEmits<{
  add: [users: string[]]
  remove: [user: string]
}>()
const adding = ref<string>('')

const add = () => {
  if (!adding.value) return
  emits('add', [adding.value])
  adding.value = ''
}

const hasError = computed(() =>
  Array.isArray(props.error) ? props.error.length > 0 : !!props.error
)
const errorMessages = computed(() => {
  if (Array.isArray(props.error)) return props.error
  return props.error ? [props.error] : []
})

// 区切り後に 2 件以上になるペーストのみ一括追加し、それ以外は通常のペーストとして扱う
const onPaste = (event: ClipboardEvent) => {
  if (!props.bulk) return
  const text = event.clipboardData?.getData('text/plain')
  if (!text) return
  const users = [
    ...new Set(
      text
        .split(/[\s,、，;]+/)
        .map((s) => s.trim())
        .filter((s) => s)
    )
  ]
  if (users.length < 2) return
  event.preventDefault()
  emits('add', users)
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
          :error="hasError"
          hide-details
          @keydown.enter="add"
          @paste="onPaste"
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
    <!-- 入力欄の幅に縛られないよう、エラーは入力欄の外にまとめて表示する -->
    <div
      v-if="errorMessages.length"
      class="text-error text-caption mt-1"
      role="alert"
    >
      <div v-for="(message, i) in errorMessages" :key="i">{{ message }}</div>
    </div>
  </div>
</template>

<style scoped lang="scss"></style>
