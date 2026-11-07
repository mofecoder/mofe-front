import type { Contest, ContestDetail } from '~/types/contest'
import type { StandingData } from '~/types/standings'
import type { Clarification } from '~/types/clarification'
import type { Submit, SubmissionDetail } from '~/types/submissions'
import type { Pagination } from '~/types/ApiMeta'
import type { SortItem } from '~/types/datatable'

export type Contests = {
  inProgress: Contest[]
  future: Contest[]
  past: Contest[]
  permanent: Contest[]
}
export type SubmissionResponse = {
  data: Submit[]
  meta: { pagination: Pagination }
}
export type FilterOptions = { task: string[]; user: string; status: string[] }

export type SubmissionsQuery = {
  page?: number
  count?: number
  sortBy?: SortItem[]
  filter?: FilterOptions
}

export type StandingsQuery = {
  excludeOpen?: boolean
  teamOnly?: boolean
  sortColumn?: string | null
  order?: 'asc' | 'desc' | null
}

// 提出一覧のクエリを backend の形式に変換する
// sort=-date,user (先頭の - は降順) / user=foo / task[]=A / status[]=AC
export function toSubmissionsQuery(q: SubmissionsQuery) {
  const sort = (q.sortBy ?? [])
    .filter((s) => s.order !== false)
    .map((s) => (s.order === 'desc' ? `-${s.key}` : s.key))
    .join(',')
  const task = q.filter?.task.filter((x) => x) ?? []
  const status = q.filter?.status.filter((x) => x) ?? []
  return {
    page: q.page,
    count: q.count,
    sort: sort || undefined,
    user: q.filter?.user || undefined,
    'task[]': task.length ? task : undefined,
    'status[]': status.length ? status : undefined
  }
}

export const contestsApi = () => {
  const api = useNuxtApp().$api
  return {
    list: () => api<Contests>('/contests'),
    get: (slug: string) => api<ContestDetail>(`/contests/${slug}`),
    standings: (slug: string, q: StandingsQuery = {}) =>
      api<StandingData>(`/contests/${slug}/standings`, {
        query: {
          exclude_open: q.excludeOpen || undefined,
          team_only: q.teamOnly || undefined,
          sort_column: q.sortColumn || undefined,
          order: q.order || undefined
        }
      }),

    clarifications: (slug: string) =>
      api<Clarification[]>(`/contests/${slug}/clarifications`),
    clarification: (p: { slug: string; id: number }) =>
      api<Clarification>(`/contests/${p.slug}/clarifications/${p.id}`),
    createClarification: (
      slug: string,
      body: { clarification: { task: string | null; question: string } }
    ) =>
      api<Clarification>(`/contests/${slug}/clarifications`, {
        method: 'POST',
        body
      }),
    updateClarification: (
      p: { slug: string; id: number },
      body: { answer: string; publish: boolean }
    ) =>
      api<Clarification>(`/contests/${p.slug}/clarifications/${p.id}`, {
        method: 'PUT',
        body
      }),

    allSubmissions: (slug: string, q: SubmissionsQuery = {}) =>
      api<SubmissionResponse>(`/contests/${slug}/submissions/all`, {
        query: toSubmissionsQuery(q)
      }),
    mySubmissions: (slug: string, q: SubmissionsQuery = {}) =>
      api<SubmissionResponse>(`/contests/${slug}/submissions`, {
        query: toSubmissionsQuery(q)
      }),
    // 同じチームのメンバー全員 (自分を含む) の提出
    teamSubmissions: (slug: string, q: SubmissionsQuery = {}) =>
      api<SubmissionResponse>(`/contests/${slug}/submissions/team`, {
        query: toSubmissionsQuery(q)
      }),
    submission: (p: { slug: string; id: number }) =>
      api<SubmissionDetail>(`/contests/${p.slug}/submissions/${p.id}`),
    togglePublished: (p: { slug: string; id: number }) =>
      api<{ public: boolean }>(
        `/contests/${p.slug}/submissions/${p.id}/toggle_published`,
        { method: 'PATCH' }
      ),
    rejudge: (slug: string, body: { submissionIds: number[] }) =>
      api<unknown>(`/contests/${slug}/rejudge`, { method: 'POST', body }),

    register: (slug: string, body: { password?: string; open?: boolean }) =>
      api<unknown>(`/contests/${slug}/registrations`, { method: 'POST', body }),
    teamRegister: (
      slug: string,
      body: {
        name: string
        passphrase: string
        password?: string
        open?: boolean
      }
    ) =>
      api<{ message: string }>(`/contests/${slug}/registrations/team`, {
        method: 'POST',
        body
      }),
    unregister: (slug: string) =>
      api<{ message: string | null } | undefined>(
        `/contests/${slug}/registrations`,
        { method: 'DELETE' }
      )
  }
}
