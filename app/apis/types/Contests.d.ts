import { Contest } from '~/types/contest'

interface ApiContests {
  index(contestSlug: string): Promise<Contest>
}
