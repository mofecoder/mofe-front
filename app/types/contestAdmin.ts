import { Difficulty, Problem as BaseProblem } from '~/types/problem'

export interface Problem extends BaseProblem {
  writerUser: string
}

export interface UnsetProblem {
  id: number
  name: string
  difficulty: Difficulty
  writerUser: string
}
