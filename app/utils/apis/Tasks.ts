import type { TaskDetail } from '~/types/task'

export const tasksApi = () => {
  const api = useNuxtApp().$api
  return {
    get: (p: { contestSlug: string; taskSlug: string }) =>
      api<TaskDetail>(`/contests/${p.contestSlug}/tasks/${p.taskSlug}`),
    // ソースコードはそのまま text/plain で送る
    submit: (
      p: { contestSlug: string; taskSlug: string },
      body: { lang: string; source: string }
    ) =>
      api<unknown>(`/contests/${p.contestSlug}/tasks/${p.taskSlug}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        query: { lang: body.lang },
        body: body.source
      })
  }
}
