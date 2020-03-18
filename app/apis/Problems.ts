import { httpPost } from '~/utils/axios'
import { CreateProblemParams } from '~/types/problem'

export default class {
  async create(params: CreateProblemParams): Promise<void> {
    await httpPost('/problems', {}, params)
  }
}
