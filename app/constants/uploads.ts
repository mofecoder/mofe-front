// 画像アップロードの制限 (backend の Upload モデルと合わせる)

export const UPLOAD_CONTENT_TYPES = [
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp'
] as const

export type UploadContentType = (typeof UPLOAD_CONTENT_TYPES)[number]

export const UPLOAD_MAX_BYTES = 5 * 1024 * 1024

// ファイル選択ダイアログの accept
export const UPLOAD_ACCEPT = UPLOAD_CONTENT_TYPES.join(',')
