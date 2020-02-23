import { Difficulty } from '~/types/contestAdmin'

export interface Problem {
  slug: string
  position?: string
  name: string
  difficulty: Difficulty
}

export interface ProblemDetail {
  slug: string
  name: string
  statement: string
  difficulty: Difficulty
  outputFormat: string
  inputFormat: string
  constraints: string
  point: number
}
