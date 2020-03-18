import {
  Contest,
  ContestCreateParam,
  ContestDetail,
  ContestDetailManage,
  ContestEditParam
} from '~/types/contest'
import { httpGet, httpPost, httpPut } from '~/utils/axios'
import { StandingData } from '~/types/standings'
import { Submit } from '~/types/submits'

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
}
