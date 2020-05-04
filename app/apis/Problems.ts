import { httpGet, httpPost, httpPut } from '~/utils/axios'
import { ProblemParams, Problem, ProblemDetail } from '~/types/problems'
import { Problem as AdminProblem } from '~/types/contestAdmin'

export default class {
  async create(params: ProblemParams): Promise<void> {
    await httpPost('/problems', {}, params)
  }

  async index(): Promise<Problem[]> {
    const res = await httpGet<Problem[]>('/problems')
    return res
  }

  async show(problemId: number): Promise<ProblemDetail> {
    const res = await httpGet<ProblemDetail>(`/problems/${problemId}`)
    return res
  }

  async update(problemId: number, params: ProblemParams) {
    await httpPut(`/problems/${problemId}`, {}, params)
  }

  async unsetProblems(): Promise<AdminProblem[]> {
    const res = await httpGet<AdminProblem[]>('/manage/problems/unset_problems')
    return res
  }
}
