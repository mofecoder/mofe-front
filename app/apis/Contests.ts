import { ApiContests } from './types/Contests'
import { Contest } from '~/types/contest'
import axios from 'axios'

export const Contests: ApiContests = {
  async index(contestSlug: string): Promise<Contest> {
    const res = await axios.get<Contest>(
      `${process.env.API_BASE}/contests/${contestSlug}`
    )
    return res.data
  }
}
