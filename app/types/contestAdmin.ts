export type Difficulty =
  | 'Milk'
  | 'Assam'
  | 'Benihuki'
  | 'Ceylon'
  | 'Darjeeling'
  | 'Earlgray'
  | 'Flavor'
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
