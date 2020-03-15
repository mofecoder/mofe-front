import { Contest } from '~/types/contest'
import { httpGet } from '~/utils/axios'
import { StandingData } from '~/types/standings'
import { Submit } from '~/types/submits'

export default class {
  async index(contestSlug: string): Promise<Contest> {
    const res = await httpGet<Contest>(`/contests/${contestSlug}`)
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
}
