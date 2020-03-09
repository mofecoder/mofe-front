import { ProblemDetail } from '~/types/problem'
import { httpGet, httpPost } from '~/utils/axios'

export default class {
  async show(contestSlug: string, slug: string): Promise<ProblemDetail> {
    const res = await httpGet<ProblemDetail>(
      `/contests/${contestSlug}/tasks/${slug}`
    )
    return res
  }

  async submit(
    contestSlug: string,
    slug: string,
    lang: string,
    source: string,
    status?: string
  ) {
    const res = await httpPost<void>(
      `/contests/${contestSlug}/tasks/${slug}/submit`,
      {
        status,
        lang
      },
      source
    )
    return res
  }
}
