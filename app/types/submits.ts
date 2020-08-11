import { Task } from '~/types/task'

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
  task: Task
  status: Result
  lang: string
  executionTime?: number
  executionMemory?: number
  point: number
}

export interface SubmitDetail extends Submit {
  source: string
}
