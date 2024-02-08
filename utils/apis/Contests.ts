import { Api } from '~/types/api'
import type { Contest, ContestDetail } from '~/types/contest'
import type { StandingData } from '~/types/standings'
import type { Clarification } from '~/types/clarification'
import type { Submit, SubmissionDetail } from '~/types/submissions'
import type { Pagination } from '~/types/ApiMeta'
import type { SortItem } from '~/types/datatable'

export type SubmissionResponse = {
  data: Submit[]
  meta: { pagination: Pagination }
}
export type FilterOptions = { task: string[]; user: string; status: string[] }

function formatSubmissionsUrl(
  url: string,
  page?: number,
  count?: number,
  sortBy?: SortItem[],
  filter?: FilterOptions
) {
  const data = []
  if (page != null) data.push(['page', page])
  if (count != null) data.push(['count', count])
  if (filter || sortBy) {
    const options: {
      sort?: { target: string; desc: boolean }[]
      filter?: { target: string; value: string[] }[]
    } = {}
    if (sortBy && sortBy.length) {
      options.sort = sortBy
        .filter((s) => s.order !== false)
        .map((s) => ({ target: s.key, desc: s.order === 'desc' }))
    }
    if (filter && Object.values(filter).some((x) => x)) {
      options.filter = Object.entries(filter)
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

const getContests = new Api<Contest[]>('/contests')
const getContest = new Api<ContestDetail, [string]>(
  ([slug]) => `/contests/${slug}`
)
const getStandings = new Api<StandingData, [string, boolean]>(
  ([slug, excludeOpen]) =>
    `/contests/${slug}/standings?${excludeOpen ? 'exclude_open' : ''}`
)

const getClarifications = new Api<Clarification[], [string]>(
  ([slug]) => `/contests/${slug}/clarifications`
)

const getClarification = new Api<Clarification, [string, number]>(
  ([slug, id]) => `/contests/${slug}/clarifications/${id}`
)

const updateClarification = new Api<
  Clarification,
  [string, number],
  { answer: string; publish: boolean }
>(([slug, id]) => `/contests/${slug}/clarifications/${id}`, 'PUT')

const createClarification = new Api<
  Clarification,
  [string],
  { clarification: { task: string | null; question: string } }
>(([slug]) => `/contests/${slug}/clarifications`, 'POST')

type GetSubmissionParams = {
  slug: string
  page?: number
  count?: number
  sortBy?: SortItem[]
  filter?: FilterOptions
}

const getAllSubmissions = new Api<SubmissionResponse, GetSubmissionParams>(
  ({ slug, page, count, sortBy, filter }) =>
    formatSubmissionsUrl(
      `/contests/${slug}/submissions/all`,
      page,
      count,
      sortBy,
      filter
    )
)

const getMySubmissions = new Api<SubmissionResponse, GetSubmissionParams>(
  ({ slug, page, count, sortBy, filter }) =>
    formatSubmissionsUrl(
      `/contests/${slug}/submissions`,
      page,
      count,
      sortBy,
      filter
    )
)

const rejudge = new Api<Submit, [string]>(
  ([slug]) => `/contests/${slug}/rejudge`,
  'POST'
)

const getSubmission = new Api<SubmissionDetail, [string, number]>(
  ([contestSlug, id]) => `/contests/${contestSlug}/submissions/${id}`
)

const register = new Api<void, [string], { password?: string; open?: boolean }>(
  ([slug]) => `/contests/${slug}/register`,
  'POST'
)

const unregister = new Api<void, [string]>(
  ([slug]) => `/contests/${slug}/unregister`,
  'DELETE'
)

export default {
  getContests,
  getContest,
  getStandings,
  getClarifications,
  getClarification,
  updateClarification,
  createClarification,
  getAllSubmissions,
  getMySubmissions,
  getSubmission,
  rejudge,
  register,
  unregister
}
