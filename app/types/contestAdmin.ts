export type Difficulty =
  | 'Green'
  | 'Ceylon'
  | 'Dimbula'
  | 'Darjeeling'
  | 'Uva'
  | 'Earlgray'
  | 'Keemun'
  | 'ผักชี'

type WriterOrTester = {
  name: string
  link?: string
}

export interface Problem {
  slug: string
  problemName: string
  writer: WriterOrTester
  tester: WriterOrTester
  difficulty: Difficulty
  points: number
}
