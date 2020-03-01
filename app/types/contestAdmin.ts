import { Difficulty } from '~/types/problem'

type WriterOrTester = {
  name: string
  link?: string
}

export interface Problem {
  slug: string
  name: string
  writer: WriterOrTester
  tester: WriterOrTester
  difficulty: Difficulty
  points: number
}
