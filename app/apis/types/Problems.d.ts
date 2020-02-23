import { Problem, ProblemDetail } from '~/types/problem'

interface ApiProblems {
  index(contestSlug: string): Promise<Problem[]>
  show(contestSlug: string, slug: string): Promise<ProblemDetail>
}
