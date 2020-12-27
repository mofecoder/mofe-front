import { Difficulty, Sample } from '~/types/task'

export interface ProblemParams {
  name: string
  difficulty: Difficulty
  statement: string
  inputFormat: string
  outputFormat: string
  constraints: string
}

export interface Problem {
  id: number
  name: string
  difficulty: Difficulty
  writerUser: string
  contest: null | {
    slug: string
    name: string
  }
}

export interface ProblemDetail {
  id: number
  executionTimeLimit: number
  name: string
  difficulty: Difficulty
  writerUser: string
  statement: string
  constraints: string
  inputFormat: string
  outputFormat: string
  samples: Sample[] | null
  testers: string[]
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
