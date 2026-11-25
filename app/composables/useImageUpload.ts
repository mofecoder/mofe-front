import SparkMD5 from 'spark-md5'
import {
  UPLOAD_CONTENT_TYPES,
  UPLOAD_MAX_BYTES,
  type UploadContentType
} from '~/constants/uploads'
import type { DirectUpload, Upload } from '~/types/upload'
import { ImageUploadError, sanitizeImage } from '~/utils/imageSanitizer'
import { uploadsApi } from '~/utils/apis'

const MAX_MB = UPLOAD_MAX_BYTES / 1024 / 1024

function isAllowedType(type: string): type is UploadContentType {
  return (UPLOAD_CONTENT_TYPES as readonly string[]).includes(type)
}

function checkFile(file: Blob) {
  if (!isAllowedType(file.type)) {
    throw new ImageUploadError(
      'アップロードできるのは PNG / JPEG / GIF / WebP の画像だけです。'
    )
  }
  if (file.size === 0) {
    throw new ImageUploadError('空のファイルはアップロードできません。')
  }
  if (file.size > UPLOAD_MAX_BYTES) {
    throw new ImageUploadError(
      `ファイルサイズは ${MAX_MB} MB 以下にしてください。`
    )
  }
}

// Active Storage と同じ形式 (MD5 のバイト列を Base64 にしたもの)
async function computeChecksum(file: Blob): Promise<string> {
  const raw = SparkMD5.ArrayBuffer.hash(await file.arrayBuffer(), true)
  return btoa(raw)
}

// ストレージへ直接 PUT する。$api は通さず、backend が返したヘッダをそのまま付ける
async function putToStorage(directUpload: DirectUpload, file: Blob) {
  const headers = new Headers()
  for (const { name, value } of directUpload.headers) headers.set(name, value)
  let res: Response
  try {
    res = await fetch(directUpload.url, { method: 'PUT', headers, body: file })
  } catch {
    throw new ImageUploadError('画像の送信に失敗しました。')
  }
  if (!res.ok) {
    throw new ImageUploadError(`画像の送信に失敗しました (${res.status})。`)
  }
}

// 画像を 1 枚アップロードして、完了したアップロード (公開 URL を含む) を返す
// 失敗したら ImageUploadError を投げる (message はそのまま表示できる)
// uploadsApi() は useNuxtApp() を使うので、setup で呼ぶこと
export function useImageUpload() {
  const repo = uploadsApi()

  const upload = async (file: File): Promise<Upload> => {
    checkFile(file)
    const prepared = await sanitizeImage(file)
    // 再エンコードで形式やサイズが変わることがあるのでもう一度確かめる
    checkFile(prepared)
    const checksum = await computeChecksum(prepared)

    let created
    try {
      created = await repo.create({
        filename: prepared.name || 'image',
        contentType: prepared.type,
        byteSize: prepared.size,
        checksum
      })
    } catch (e) {
      throw new ImageUploadError(
        getErrorMessage(e, '画像のアップロードを開始できませんでした。')
      )
    }

    await putToStorage(created.directUpload, prepared)

    try {
      return await repo.complete(created.upload.id)
    } catch (e) {
      throw new ImageUploadError(
        getErrorMessage(e, '画像のアップロードを完了できませんでした。')
      )
    }
  }

  return { upload }
}
