import {
  Contest,
  ContestCreateParam,
  ContestDetail,
  ContestDetailManage,
  ContestEditParam
} from '~~/types/contest'
import { httpGet, httpPost, httpPut } from '~~/utils/axios'
import { StandingData } from '~~/types/standings'
import { Submit, SubmitDetail } from '~~/types/submits'
import { Clarification } from '~~/types/clarification'
import { Pagination } from '~~/types/ApiMeta'

export type SubmissionResponse = {
  data: Submit[]
  meta: { pagination: Pagination }
}

function formatSubmissionsUrl(
  url: string,
  page?: number,
  count?: number,
  sortBy?: string[],
  sortDesc?: boolean[],
  filter?: [string, string | string[]][]
) {
  const data = []
  if (page != null) data.push(['page', page])
  if (count != null) data.push(['count', count])
  if (filter || (sortBy && sortDesc)) {
    const options: {
      sort?: { target: string; desc: boolean }[]
      filter?: { target: string; value: string[] }[]
    } = {}
    if (sortBy && sortBy.length && sortDesc) {
      options.sort = sortBy.map((by, i) => ({ target: by, desc: sortDesc[i] }))
    }
    if (filter && filter.length) {
      options.filter = filter
        .map((f) => ({
          target: f[0],
          value: Array.isArray(f[1]) ? f[1] : [f[1]]
        }))
        .filter((f) => f.value.filter((x) => x).length)
    }
    data.push(['options', JSON.stringify(options)])
  }
  const query = data.map((a) => `${a[0]}=${a[1]}`).join('&')
  if (query) url += `?${query}`
  return url
}

export default class {
  async index(): Promise<Contest[]> {
    const res = await httpGet<Contest[]>('/contests')
    return res
  }

  async show(contestSlug: string): Promise<ContestDetail> {
    const res = await httpGet<ContestDetail>(`/contests/${contestSlug}`)
    return res
  }

  async standings(contestSlug: string): Promise<StandingData> {
    const res = await httpGet<StandingData>(
      `/contests/${contestSlug}/standings`
    )
    return res
  }

  async allSubmits(
    contestSlug: string,
    page?: number,
    count?: number,
    sortBy?: string[],
    sortDesc?: boolean[],
    filter?: [string, string | string[]][]
  ): Promise<SubmissionResponse> {
    const res = await httpGet<SubmissionResponse>(
      formatSubmissionsUrl(
        `/contests/${contestSlug}/submits/all`,
        page,
        count,
        sortBy,
        sortDesc,
        filter
      )
    )
    return res
  }

  async mySubmits(
    contestSlug: string,
    page?: number,
    count?: number,
    sortBy?: string[],
    sortDesc?: boolean[],
    filter?: [string, string | string[]][]
  ): Promise<SubmissionResponse> {
    const res = await httpGet<SubmissionResponse>(
      formatSubmissionsUrl(
        `/contests/${contestSlug}/submits`,
        page,
        count,
        sortBy,
        sortDesc,
        filter
      )
    )
    return res
  }

  async showSubmit(contestSlug: string, id: number): Promise<SubmitDetail> {
    const res = await httpGet<SubmitDetail>(
      `/contests/${contestSlug}/submits/${id}`
    )
    return res
  }

  async clarifications(contestSlug: string): Promise<Clarification[]> {
    const res = await httpGet<Clarification[]>(
      `/contests/${contestSlug}/clarifications`
    )
    return res
  }

  async clarification(contestSlug: string, id: number): Promise<Clarification> {
    const res = await httpGet<Clarification>(
      `/contests/${contestSlug}/clarifications/${id}`
    )
    return res
  }

  async updateClarification(
    contestSlug: string,
    id: number,
    params: {
      answer: string
      publish: boolean
    }
  ) {
    await httpPut(
      `/contests/${contestSlug}/clarifications/${id}`,
      {},
      { clarification: params }
    )
  }

  async createClarification(
    contestSlug: string,
    taskSlug: string | null,
    question: string
  ) {
    await httpPost(
      `/contests/${contestSlug}/clarifications`,
      {},
      {
        clarification: {
          task: taskSlug,
          question
        }
      }
    )
  }

  async create(contestInfo: ContestCreateParam): Promise<void> {
    await httpPost('/contests', {}, contestInfo)
  }

  async update(
    contestSlug: string,
    contestInfo: ContestEditParam
  ): Promise<void> {
    console.log(contestInfo)
    await httpPut(`/contests/${contestSlug}`, {}, contestInfo)
  }

  async holding(): Promise<Contest[]> {
    const res = await httpGet<Contest[]>('/manage/contests')
    return res
  }

  async showManage(contestSlug: string): Promise<ContestDetailManage> {
    const res = await httpGet<ContestDetailManage>(
      `/manage/contests/${contestSlug}`
    )
    return res
  }

  async addTask(
    contestSlug: string,
    problemId: number,
    problemSlug: string,
    position: string
  ): Promise<void> {
    await httpPut(
      `/contests/${contestSlug}/set_task` +
        `?problem_id=${problemId}` +
        `&problem_slug=${problemSlug}` +
        `&position=${position}`
    )
  }

  async removeTask(contestSlug: string, problemSlug: string): Promise<void> {
    await httpPut(
      `/contests/${contestSlug}/tasks/${problemSlug}/remove_from_contest`
    )
  }

  async register(contestSlug: string): Promise<void> {
    await httpPost(`/contests/${contestSlug}/register`)
  }

  async rejudge(contestSlug: string, id: number[]): Promise<void> {
    await httpPost(`/contests/${contestSlug}/rejudge`, {}, { submitIds: id })
  }
}
