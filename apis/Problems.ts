import { httpDelete, httpGet, httpPost, httpPut } from '~~/utils/axios'
import { ProblemParams, Problem, ProblemDetail } from '~~/types/problems'
import { Problem as AdminProblem } from '~~/types/contestAdmin'

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

  async addTester(problemId: number, name: string): Promise<void> {
    await httpPost(
      `/problems/${problemId}/tester_relations`,
      {},
      {
        userName: name
      }
    )
  }

  async removeTester(problemId: number, name: string): Promise<void> {
    await httpDelete(
      `/problems/${problemId}/tester_relations`,
      {},
      {
        userName: name
      }
    )
  }

  async updateChecker(
    problemId: number,
    type: string | undefined,
    file: File | null
  ) {
    const form = new FormData()
    if (file) form.append('file', file)
    if (type) form.append('type', type)
    const res = await httpPost(
      `/problems/${problemId}/checker`,
      {},
      form,
      true,
      2 * 60 * 1000
    )
    return res
  }
}
