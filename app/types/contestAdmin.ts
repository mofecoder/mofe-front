import { Problem as BaseProblem } from '~/types/problem'

export interface Problem extends BaseProblem {
  writerUser: string
}
