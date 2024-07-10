import type { Task } from '~~/types/task'

type Result =
  | 'WJ'
  | 'AC'
  | 'WA'
  | 'TLE'
  | 'RE'
  | 'OLE'
  | 'QLE'
  | 'IE'
  | 'CE'
  | 'MLE'
  | 'WR'
  | 'CP'

export type SubmissionResult = Result

export interface Submit {
  id: number
  timestamp: Date
  user: {
    name: string
  }
  task: Task
  status: Result
  lang: string
  executionTime: number | null
  executionMemory: number | null
  point: number
  judgeStatus: { completed: number; all: number } | null
}

export interface TestcaseResult {
  testcaseName: string | null
  status: Result
  executionTime: number
  executionMemory: number
}

export interface TestcaseSetResult {
  name: string
  score: number
  point: number
  testcases: string[] | null
  results: Record<'ac' | 'wa' | 'tle' | 'mle' | 'ole' | 'qle' | 're', number>
}

export interface SubmissionDetail extends Submit {
  source: string
  sampleCount: number | null
  compileError: string | null
  testcaseResults: TestcaseResult[]
  testcaseSets: TestcaseSetResult[]
}
