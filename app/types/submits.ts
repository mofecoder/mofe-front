import { Problem } from '~/types/problem'

type Result =
  | 'WJ'
  | 'AC'
  | 'WA'
  | 'TLE'
  | 'RE'
  | 'OLE'
  | 'IE'
  | 'CE'
  | 'MLE'
  | 'WR'

export interface Submit {
  id: number
  timestamp: Date
  user: {
    name: string
  }
  task: Problem
  status: Result
  lang: string
  executionTime?: number
  executionMemory?: number
  point: number
}
