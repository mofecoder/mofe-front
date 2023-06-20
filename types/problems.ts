import { Difficulty, Sample } from '~~/types/task'
import { Contest } from '~~/types/contest'

export interface ProblemParams {
  name: string
  difficulty: Difficulty
  statement: string
  inputFormat: string
  outputFormat: string
  constraints: string
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

export interface TestcaseSet {
  id: number
  name: string
  points: number
  isSample: boolean
}

export interface Testcase {
  id: number
  name: string
  testcaseSets: boolean[]
}
