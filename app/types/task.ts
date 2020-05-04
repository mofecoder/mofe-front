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
  position: string
  name: string
  difficulty: Difficulty
  points: number
}

export interface TaskDetail extends Task {
  statement: string
  outputFormat: string
  inputFormat: string
  constraints: string
  samples: Sample[]
}
