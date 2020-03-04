export type Difficulty =
  | 'Milk'
  | 'Assam'
  | 'Benihuki'
  | 'Ceylon'
  | 'Darjeeling'
  | 'Earlgray'
  | 'Flavor'
  | 'ผักชี'

type Sample = {
  input: string
  output: string
  explanation?: string
}

export interface Problem {
  slug: string
  position?: string
  name: string
  difficulty: Difficulty
}

export interface ProblemDetail {
  slug: string
  position: string
  name: string
  statement: string
  difficulty: Difficulty
  outputFormat: string
  inputFormat: string
  constraints: string
  point: number
  samples: Sample[]
}
