import type {
  CreateUploadParams,
  CreateUploadResponse,
  Upload,
  UploadsResponse
} from '~/types/upload'

// 画像アップロード (v4)
export const uploadsApi = () => {
  const api = useNuxtApp().$apiV4
  return {
    list: (q: { page?: number } = {}) =>
      api<UploadsResponse>('/uploads', { query: { page: q.page } }),
    create: (params: CreateUploadParams) =>
      api<CreateUploadResponse>('/uploads', {
        method: 'POST',
        body: { upload: params }
      }),
    complete: (id: number) =>
      api<Upload>(`/uploads/${id}/complete`, { method: 'POST' }),
    destroy: (id: number) => api(`/uploads/${id}`, { method: 'DELETE' })
  }
}
