<script setup lang="ts">
// Markdown を書くテキストエリア。画像のアップロード (ボタン / ドラッグ＆ドロップ / 貼り付け) ができる
// アップロードが終わるとカーソル位置に ![](公開 URL) を挿入する
// v-textarea の属性 (label, rules, maxlength など) はそのまま渡せる
import { UPLOAD_ACCEPT, UPLOAD_MAX_BYTES } from '~/constants/uploads'
import { useUserStore } from '~/store/user'
import { ImageUploadError } from '~/utils/imageSanitizer'

defineOptions({ inheritAttrs: false })

const model = defineModel<string | null | undefined>({ default: '' })
const props = defineProps<{ disabled?: boolean; readonly?: boolean }>()
const attrs = useAttrs()

const userStore = useUserStore()
// backend の UploadPolicy と同じく writer と admin だけ
const canUpload = computed(() =>
  ['writer', 'admin'].includes(userStore.user?.role ?? '')
)
const enabled = computed(
  () => canUpload.value && !props.disabled && !props.readonly
)

const { upload } = useImageUpload()

const root = ref<HTMLElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const uploading = ref(false)
const dragging = ref(false)
const errors = ref<string[]>([])
// 一度もフォーカスしていなければ末尾に挿入する (selectionStart が 0 のままなので)
// v-textarea の @focus は内部の textarea に届かないので、ルートの focusin で拾う
const focused = ref(false)

const maxMb = UPLOAD_MAX_BYTES / 1024 / 1024

function textareaElement(): HTMLTextAreaElement | null {
  return root.value?.querySelector('textarea.v-field__input') ?? null
}

// アップロードボタンなど、textarea 以外へのフォーカスは数えない
function onFocusIn(e: FocusEvent) {
  if (e.target === textareaElement()) focused.value = true
}

function currentSelection(): [number, number] {
  const el = textareaElement()
  if (!el) {
    const length = (model.value ?? '').length
    return [length, length]
  }
  if (!focused.value) return [el.value.length, el.value.length]
  return [el.selectionStart, el.selectionEnd]
}

// [start, end) を text で置き換え、カーソルを挿入した文字列の後ろに置く
function insertText(text: string, [start, end]: [number, number]) {
  const value = model.value ?? ''
  const from = Math.min(start, value.length)
  const to = Math.min(Math.max(end, from), value.length)
  model.value = value.slice(0, from) + text + value.slice(to)
  nextTick(() => {
    const el = textareaElement()
    if (!el) return
    const pos = from + text.length
    el.focus()
    el.setSelectionRange(pos, pos)
  })
}

async function uploadFiles(files: File[]) {
  if (!enabled.value || files.length === 0 || uploading.value) return
  // アップロード中にカーソルが動いても、操作したときの位置に挿入する
  const selection = currentSelection()
  uploading.value = true
  errors.value = []
  const urls: string[] = []
  try {
    for (const file of files) {
      try {
        const uploaded = await upload(file)
        if (uploaded.url) urls.push(uploaded.url)
      } catch (e) {
        const message =
          e instanceof ImageUploadError
            ? e.message
            : '画像のアップロードに失敗しました。'
        errors.value.push(`${file.name || '画像'}: ${message}`)
      }
    }
  } finally {
    uploading.value = false
  }
  if (urls.length > 0) {
    insertText(urls.map((url) => `![](${url})`).join('\n'), selection)
  }
}

function hasFiles(e: DragEvent) {
  return e.dataTransfer?.types.includes('Files') ?? false
}

function onDragOver(e: DragEvent) {
  if (!enabled.value || !hasFiles(e)) return
  e.preventDefault()
  dragging.value = true
}

function onDrop(e: DragEvent) {
  dragging.value = false
  // テキストのドロップはそのまま textarea に任せる
  if (!enabled.value || !hasFiles(e)) return
  e.preventDefault()
  uploadFiles(Array.from(e.dataTransfer?.files ?? []))
}

// クリップボードのテキストを優先して貼るか
// 表計算ソフトのセルのようにテキストと画像の両方を持つときはテキストとして貼る。
// ただし Finder などでファイルをコピーしたときはファイル名がテキストとして入るので、
// テキストがファイル名だけならファイルとして扱う
function prefersText(data: DataTransfer, files: File[]): boolean {
  const text = data.getData('text/plain').trim()
  if (!text) return false
  const names = new Set(files.map((f) => f.name))
  return !text
    .split(/\r\n|\r|\n/)
    .map((line) => line.trim())
    .filter((line) => line)
    .every((line) => names.has(line))
}

function onPaste(e: ClipboardEvent) {
  if (!enabled.value || !e.clipboardData) return
  const files = Array.from(e.clipboardData.files).filter((f) =>
    f.type.startsWith('image/')
  )
  if (files.length === 0 || prefersText(e.clipboardData, files)) return
  e.preventDefault()
  uploadFiles(files)
}

function onFileSelected(e: Event) {
  const input = e.target as HTMLInputElement
  const files = Array.from(input.files ?? [])
  // 同じファイルをもう一度選べるようにする
  input.value = ''
  uploadFiles(files)
}
</script>

<template>
  <div
    ref="root"
    class="markdown-textarea"
    :class="{ 'markdown-textarea--dragging': dragging }"
    @paste="onPaste"
    @dragover="onDragOver"
    @dragleave="dragging = false"
    @drop="onDrop"
    @focusin="onFocusIn"
  >
    <v-textarea
      v-model="model"
      v-bind="attrs"
      :disabled="disabled"
      :readonly="readonly"
      :loading="uploading"
    />
    <div v-if="canUpload" class="d-flex align-center flex-wrap ga-2 mb-2">
      <v-btn
        size="small"
        variant="tonal"
        prepend-icon="mdi-image-plus"
        :loading="uploading"
        :disabled="!enabled"
        @click="fileInput?.click()"
      >
        画像をアップロード（最大 {{ maxMb }} MB）
      </v-btn>
      <input
        ref="fileInput"
        type="file"
        :accept="UPLOAD_ACCEPT"
        multiple
        hidden
        @change="onFileSelected"
      >
    </div>
    <v-alert
      v-if="errors.length > 0"
      type="error"
      density="compact"
      variant="tonal"
      closable
      class="mb-2 markdown-textarea__errors"
      @click:close="errors = []"
    >
      {{ errors.join('\n') }}
    </v-alert>
  </div>
</template>

<style scoped>
.markdown-textarea--dragging :deep(.v-field) {
  outline: 2px dashed rgb(var(--v-theme-primary));
  outline-offset: 2px;
}

.markdown-textarea__errors {
  white-space: pre-line;
}
</style>
