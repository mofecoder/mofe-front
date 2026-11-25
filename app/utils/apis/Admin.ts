import type { User } from '~/types/adminUser'

export const adminApi = () => {
  const api = useNuxtApp().$api
  return {
    users: () => api<User[]>('/users'),
    updateUserRole: (id: number, body: Pick<User, 'role'>) =>
      api<unknown>(`/users/${id}/update_admin`, { method: 'PATCH', body }),
    // 進捗を "現在,全体" の形式で逐次返すストリーム
    updateRating: () =>
      api<ReadableStream<Uint8Array>>('/users/update_rating', {
        method: 'POST',
        responseType: 'stream'
      })
  }
}
