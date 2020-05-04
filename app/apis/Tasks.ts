import { TaskDetail } from '~/types/task'
import { httpGet, httpPost } from '~/utils/axios'

export default class {
  async show(contestSlug: string, slug: string): Promise<TaskDetail> {
    const res = await httpGet<TaskDetail>(
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
