import { httpGet, httpPost } from '~/utils/axios'
import { CreateProblemParams } from '~/types/problem'
import { UnsetProblem } from '~/types/contestAdmin'

export default class {
  async create(params: CreateProblemParams): Promise<void> {
    await httpPost('/problems', {}, params)
  }

  async index(): Promise<UnsetProblem[]> {
    const res = await httpGet<UnsetProblem[]>('/problems')
    return res
  }
}
