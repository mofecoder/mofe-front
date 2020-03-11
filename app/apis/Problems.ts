import { ProblemDetail } from '~/types/problem'
import { httpGet } from '~/utils/axios'

export default class {
  async show(contestSlug: string, slug: string): Promise<ProblemDetail> {
    const res = await httpGet<ProblemDetail>(
      `/contests/${contestSlug}/tasks/${slug}`
    )
    return res
  }
}
