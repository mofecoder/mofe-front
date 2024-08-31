import { Api } from '~/types/api'
import type { Contest } from '~/types/contest'
import type { Problem } from '~/types/problems'
import type { Post } from '~/types/post'

export * from './Posts'
export * from './Contests'
export * from './Tasks'

const top = new Api<{
  contests: Contest[]
  creating: Problem[] | null
  posts: Post[]
}>('/top')

export { top }
