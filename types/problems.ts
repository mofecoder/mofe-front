import type { Difficulty, Sample } from '~~/types/task'
import type { Contest } from '~~/types/contest'

export interface ProblemParams {
  name: string
  difficulty: Difficulty
  statement: string
  inputFormat: string
  outputFormat: string
  constraints: string
  executionTimeLimit: number
}

export interface ProblemBase {
  name: string
  difficulty: Difficulty
}

export interface Problem extends ProblemBase {
  id: number
  writerUser: string
  contest: null | {
    slug: string
    name: string
  }
}

export interface ProblemDetail {
  id: number
  slug: string | null
  executionTimeLimit: number
  name: string
  difficulty: Difficulty
  writerUser: string
  statement: string
  constraints: string
  inputFormat: string
  outputFormat: string
  checkerPath: string | null
  samples: Sample[] | null
  testers: string[]
  contest: Contest | null
}

export type AggregateType = 'all' | 'sum' | 'max' | 'min'

export interface TestcaseSet {
  id: number
  name: string
  points: number
  aggregateType: AggregateType
  isSample: boolean
}

export interface Testcase {
  id: number
  name: string
  testcaseSets: boolean[]
}
