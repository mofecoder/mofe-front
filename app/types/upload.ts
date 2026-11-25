// 画像アップロード (v4 の /uploads)

export type UploadStatus = 'pending' | 'completed' | 'rejected'

export interface Upload {
  id: number
  status: UploadStatus
  createdAt: string
  filename: string | null
  contentType: string | null
  byteSize: number | null
  // Markdown に貼る公開 URL
  url: string | null
}

// ストレージへ直接 PUT するための署名付き URL とヘッダ
// ヘッダは $api のキー変換で壊れないよう { name, value } の配列で返ってくる
export interface DirectUpload {
  url: string
  headers: { name: string; value: string }[]
}

export interface CreateUploadParams {
  filename: string
  contentType: string
  byteSize: number
  // MD5 の Base64 (Active Storage と同じ形式)
  checksum: string
}

export interface CreateUploadResponse {
  upload: Upload
  directUpload: DirectUpload
}

export interface UploadsResponse {
  uploads: Upload[]
  meta: {
    totalCount: number
    page: number
    perPage: number
    usedBytes: number
    // admin は無制限なので null
    quotaBytes: number | null
  }
}
