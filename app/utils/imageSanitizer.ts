// アップロード前の画像の前処理
// JPEG と WebP は位置情報などのメタデータを除くため、ブラウザで再エンコードする

const EXTENSIONS: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/gif': 'gif',
  'image/webp': 'webp'
}

// 再エンコードの品質 (JPEG / WebP)
const QUALITY = 0.92

export class ImageUploadError extends Error {}

// 再エンコードした結果の形式に合わせて拡張子を付け替える
export function renameForType(filename: string, type: string): string {
  const ext = EXTENSIONS[type]
  if (!ext) return filename
  const base = filename.replace(/\.[^./\\]+$/, '') || 'image'
  return `${base}.${ext}`
}

function readFourCC(view: DataView, offset: number): string {
  return String.fromCharCode(
    view.getUint8(offset),
    view.getUint8(offset + 1),
    view.getUint8(offset + 2),
    view.getUint8(offset + 3)
  )
}

// アニメーション WebP か (VP8X チャンクのアニメーションフラグ)
function isAnimatedWebp(buf: ArrayBuffer): boolean {
  const view = new DataView(buf)
  if (buf.byteLength < 21) return false
  if (readFourCC(view, 0) !== 'RIFF' || readFourCC(view, 8) !== 'WEBP')
    return false
  return readFourCC(view, 12) === 'VP8X' && (view.getUint8(20) & 0x02) !== 0
}

// WebP から EXIF / XMP チャンクを取り除く (画像データには触れない)
// アニメーション WebP は canvas で再エンコードすると 1 フレームになるので、こちらで処理する
function stripWebpMetadata(buf: ArrayBuffer): Blob {
  const view = new DataView(buf)
  const chunks: Uint8Array[] = []
  let offset = 12
  while (offset + 8 <= buf.byteLength) {
    const fourCC = readFourCC(view, offset)
    const size = view.getUint32(offset + 4, true)
    // チャンクは偶数バイトに揃えられている
    const end = Math.min(offset + 8 + size + (size % 2), buf.byteLength)
    if (fourCC !== 'EXIF' && fourCC !== 'XMP ') {
      const chunk = new Uint8Array(buf.slice(offset, end))
      if (fourCC === 'VP8X') {
        // EXIF (0x08) と XMP (0x04) のフラグを下ろす
        chunk[8] = chunk[8]! & ~(0x08 | 0x04)
      }
      chunks.push(chunk)
    }
    offset = end
  }

  const bodySize = chunks.reduce((sum, c) => sum + c.byteLength, 0)
  const header = new Uint8Array(12)
  const headerView = new DataView(header.buffer)
  header.set([0x52, 0x49, 0x46, 0x46]) // RIFF
  headerView.setUint32(4, bodySize + 4, true)
  header.set([0x57, 0x45, 0x42, 0x50], 8) // WEBP
  return new Blob([header, ...chunks], { type: 'image/webp' })
}

// canvas に描き直して再エンコードする (メタデータは引き継がれない)
// EXIF の向きは createImageBitmap が適用する
async function reencode(file: Blob, type: string): Promise<Blob> {
  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(file)
  } catch {
    throw new ImageUploadError('画像を読み込めませんでした。')
  }
  const canvas = document.createElement('canvas')
  canvas.width = bitmap.width
  canvas.height = bitmap.height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new ImageUploadError('画像を変換できませんでした。')
  ctx.drawImage(bitmap, 0, 0)
  bitmap.close()

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, type, QUALITY)
  )
  if (!blob) {
    throw new ImageUploadError(
      '画像を変換できませんでした。画像が大きすぎる可能性があります。'
    )
  }
  // WebP を書き出せないブラウザ (Safari など) では PNG になる。その場合は返ってきた形式を使う
  return blob
}

// アップロードする形に整える。JPEG と WebP はメタデータを除く
export async function sanitizeImage(file: File): Promise<File> {
  if (file.type === 'image/jpeg') {
    const blob = await reencode(file, 'image/jpeg')
    return new File([blob], renameForType(file.name, blob.type), {
      type: blob.type
    })
  }
  if (file.type === 'image/webp') {
    const buf = await file.arrayBuffer()
    const blob = isAnimatedWebp(buf)
      ? stripWebpMetadata(buf)
      : await reencode(file, 'image/webp')
    return new File([blob], renameForType(file.name, blob.type), {
      type: blob.type
    })
  }
  return file
}
