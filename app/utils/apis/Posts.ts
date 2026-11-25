import type { Post } from '~/types/post'

export type PostParams = Pick<Post, 'title' | 'content' | 'publicStatus'>

export const postsApi = () => {
  const api = useNuxtApp().$api
  return {
    list: (q: { count?: number } = {}) =>
      api<Post[]>('/posts', { query: { count: q.count } }),
    get: (id: number) => api<Post>(`/posts/${id}`),
    create: (body: PostParams) =>
      api<Post>('/posts', { method: 'POST', body }),
    update: (id: number, body: PostParams) =>
      api<Post>(`/posts/${id}`, { method: 'PUT', body })
  }
}
