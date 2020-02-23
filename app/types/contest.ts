import { Problem } from '~/types/problem'

export interface Contest {
  id: number
  slug: string
  name: string
  tasks: Problem[]
}
