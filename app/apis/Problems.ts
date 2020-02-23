import { ApiProblems } from './types/Problems'
import { Problem, ProblemDetail } from '~/types/problem'
import axios from 'axios'

export const Problems: ApiProblems = {
  async index(contestSlug: string): Promise<Problem[]> {
    const res = await axios.get<Problem[]>(
      `${process.env.API_BASE}/contests/${contestSlug}/tasks`
    )
    return res.data
  },
  async show(contestSlug: string, slug: string): Promise<ProblemDetail> {
    const res = await axios.get<ProblemDetail>(
      `${process.env.API_BASE}/contests/${contestSlug}/tasks/${slug}`
    )
    return res.data
  }
}
