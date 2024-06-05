export type Difficulty =
  | 'Milk'
  | 'Assam'
  | 'Benihuki'
  | 'Ceylon'
  | 'Darjeeling'
  | 'Earlgray'
  | 'Flavor'
  | 'ผักชี'

export type Sample = {
  input: string
  output: string
  explanation?: string
}

export interface Task {
  slug: string
  executionTimeLimit: number
  position: string
  name: string
  difficulty: Difficulty
  points: number
  accepted: boolean
}

export interface TaskDetail extends Task {
  statement: string
  outputFormat: string
  inputFormat: string
  constraints: string
  samples: Sample[]
}
