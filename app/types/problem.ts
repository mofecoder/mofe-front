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
  position: string
  name: string
  difficulty: Difficulty
  points: number
}

export interface ProblemDetail extends Problem {
  statement: string
  outputFormat: string
  inputFormat: string
  constraints: string
  samples: Sample[]
}

export interface CreateProblemParams {
  name: string
  difficulty: Difficulty
  statement: string
  inputFormat: string
  outputFormat: string
  constraints: string
}
