import type { Difficulty, Task as BaseProblem } from '~~/types/task'

export interface Task extends BaseProblem {
  writerUser: string
}

export interface Problem {
  id: number
  slug?: string
  position?: string
  name: string
  difficulty: Difficulty
  points?: number
  writerUser: string
}
