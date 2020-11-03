import {
  Contest,
  ContestCreateParam,
  ContestDetail,
  ContestDetailManage,
  ContestEditParam
} from '~/types/contest'
import { httpGet, httpPost, httpPut } from '~/utils/axios'
import { StandingData } from '~/types/standings'
import { Submit, SubmitDetail } from '~/types/submits'
import { Clarification } from '~/types/clarification'

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

  async allSubmits(contestSlug: string): Promise<Submit[]> {
    const res = await httpGet<Submit[]>(`/contests/${contestSlug}/submits/all`)
    return res
  }

  async mySubmits(contestSlug: string): Promise<Submit[]> {
    const res = await httpGet<Submit[]>(`/contests/${contestSlug}/submits`)
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
}
