import { Problem } from '~/types/problem'

type Result = 'WJ' | 'AC' | 'WA' | 'TLE' | 'RE' | 'OLE' | 'IE' | 'CE'

export interface Submit {
  id: number
  timestamp: Date
  user: {
    name: string
  }
  task: Problem
  result: Result
  executionTime?: number
  memory?: number
  points: number
}
