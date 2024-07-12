import type { SubmissionResult } from '~/types/submissions'

export const JUDGE_STATUSES = [
  'WJ',
  'AC',
  'WA',
  'TLE',
  'RE',
  'OLE',
  'QLE',
  'IE',
  'CE',
  'MLE',
  'WR',
  'CP'
] as const satisfies SubmissionResult[]
