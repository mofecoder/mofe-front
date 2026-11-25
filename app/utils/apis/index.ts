import type { Contest } from '~/types/contest'
import type { Problem } from '~/types/problems'
import type { Post } from '~/types/post'

export * from './Admin'
export * from './Auth'
export * from './Contests'
export * from './ManageContests'
export * from './ManageProblems'
export * from './Posts'
export * from './Tasks'

export type TopResponse = {
  contests: Contest[]
  creating: Problem[] | null
  posts: Post[]
}

export const topApi = () => {
  const api = useNuxtApp().$api
  return {
    get: () => api<TopResponse>('/top')
  }
}
