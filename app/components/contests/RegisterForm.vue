<script setup lang="ts">
const props = defineProps<{
  registered: { name: string | null; open: boolean } | null
  allowTeam: boolean
  restriction: boolean
  allowOpen: boolean
  loading: boolean
}>()

const emits = defineEmits<{
  individual: [string?, boolean?]
  team: [string, string, string?, boolean?]
  unregister: []
}>()

const teamRegistration = ref(false)
const openRegistration = ref(false)
const teamName = ref('')
const passphrase = ref('')
const password = ref('')

const disabledSubmit = computed(() => {
  if (teamRegistration.value && (!teamName.value || !passphrase.value))
    return true
  return props.restriction && !openRegistration.value && !password.value
})

const submit = () => {
  if (teamRegistration.value) {
    emits(
      'team',
      teamName.value,
      passphrase.value,
      password.value,
      openRegistration.value
    )
  } else {
    emits('individual', password.value, openRegistration.value)
  }
}
</script>

<template>
  <v-card
    :variant="allowTeam || allowOpen ? 'outlined' : 'flat'"
    :loading="loading"
  >
    <v-card-text :class="!allowTeam && !allowOpen && 'pa-0'">
      <div v-if="registered">
        <v-alert density="compact" variant="tonal" color="info" class="mb-4">
          <v-alert-title>参加登録済みです</v-alert-title>
          <p v-if="allowTeam">
            {{
              registered.name
                ? `チーム「${registered.name}」で参加`
                : '個人参加'
            }}
          </p>
          <p v-if="allowOpen">
            {{ registered.open ? 'オープン参加' : '通常参加' }}
          </p>
        </v-alert>
        <v-btn
          color="error"
          prepend-icon="mdi-cancel"
          variant="outlined"
          @click="$emit('unregister')"
        >
          参加登録を取り消す
        </v-btn>
      </div>
      <div v-else class="px-0 d-flex flex-column ga-2">
        <div v-if="allowTeam">
          <v-btn-toggle
            v-model="teamRegistration"
            color="purple"
            variant="outlined"
            density="compact"
            mandatory
          >
            <v-btn :value="false">
              <v-icon start>mdi-account</v-icon>
              個人参加
            </v-btn>
            <v-btn :value="true">
              <v-icon start>mdi-account-group</v-icon>
              チーム参加
            </v-btn>
          </v-btn-toggle>
        </div>
        <div v-if="restriction">
          <v-btn-toggle
            v-model="openRegistration"
            color="secondary"
            variant="outlined"
            divided
            :disabled="!allowOpen"
            density="compact"
            mandatory
          >
            <v-btn :value="false" color="primary">
              <v-icon start>mdi-lock</v-icon>
              通常参加
            </v-btn>
            <v-btn :value="true" color="secondary">
              <v-icon start>mdi-lock-open-variant</v-icon>
              オープン参加
            </v-btn>
          </v-btn-toggle>
        </div>
        <div v-if="teamRegistration" class="mt-4">
          <v-text-field
            v-model="teamName"
            label="チーム名"
            variant="underlined"
            prepend-icon="mdi-rename"
            density="compact"
            autocomplete="off"
          />
          <v-text-field
            v-model="passphrase"
            variant="underlined"
            label="チームのパスフレーズ"
            prepend-icon="mdi-lock-question"
            density="compact"
            autocomplete="off"
          />
        </div>
        <div v-if="restriction && !openRegistration">
          <v-text-field
            v-model="password"
            variant="underlined"
            label="参加登録パスワード"
            prepend-icon="mdi-form-textbox-password"
            autocomplete="off"
          />
        </div>
        <v-btn
          class="mt-2"
          color="info"
          :disabled="disabledSubmit"
          :prepend-icon="
            restriction && !openRegistration ? 'mdi-send-lock' : 'mdi-send'
          "
          :loading="loading"
          @click="submit"
        >
          参加登録する
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped lang="scss"></style>
