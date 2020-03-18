import { Problem } from '~/types/problem'

export interface Contest {
  slug: string
  name: string
  startAt: Date
  endAt: Date
  tasks: Problem[]
}

export interface ContestDetail extends Contest {
  description: string
  penaltyTime: number
}
