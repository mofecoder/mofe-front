import type {
  AddAdminsResult,
  Contest,
  ContestCreateParam,
  ContestDetailManage,
  ContestEditParam
} from '~/types/contest'

export const manageContestsApi = () => {
  const api = useNuxtApp().$api
  return {
    list: () => api<Contest[]>('/manage/contests'),
    get: (slug: string) => api<ContestDetailManage>(`/manage/contests/${slug}`),
    create: (body: ContestCreateParam) =>
      api<Contest>('/contests', { method: 'POST', body }),
    update: (slug: string, body: ContestEditParam) =>
      api<Contest>(`/contests/${slug}`, { method: 'PUT', body }),
    addTask: (
      slug: string,
      q: { problemId: number; problemSlug: string; position: string }
    ) =>
      api<unknown>(`/contests/${slug}/set_task`, {
        method: 'PUT',
        query: {
          problem_id: q.problemId,
          problem_slug: q.problemSlug,
          position: q.position
        }
      }),
    removeTask: (p: { slug: string; taskSlug: string }) =>
      api<unknown>(`/contests/${p.slug}/tasks/${p.taskSlug}/remove_from_contest`, {
        method: 'PUT'
      }),
    // 問題の位置を変更する。移動先に別の問題があれば入れ替える
    moveTask: (p: { slug: string; taskSlug: string }, position: string) =>
      api<unknown>(`/contests/${p.slug}/tasks/${p.taskSlug}/move`, {
        method: 'PUT',
        query: { position }
      }),
    // 複数人をまとめて追加する。追加できなかったユーザは errors に入る
    addAdmins: (slug: string, body: { userNames: string[] }) =>
      api<AddAdminsResult>(`/contests/${slug}/contest_admins`, {
        method: 'POST',
        body
      }),
    removeAdmin: (slug: string, body: { userName: string }) =>
      api<unknown>(`/contests/${slug}/contest_admins`, { method: 'DELETE', body })
  }
}
