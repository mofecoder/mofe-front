import type { TaskDetail } from '~/types/task'
import { Api } from '~/types/api'

const getTask = new Api<TaskDetail, [string, string]>(
  ([slug, task]) => `/api/contests/${slug}/tasks/${task}`
)

const submit = new Api<
  void,
  {
    contestSlug: string
    taskSlug: string
    lang: string
  }
>(
  ({ contestSlug, taskSlug }) =>
    `/api/contests/${contestSlug}/tasks/${taskSlug}/submit`,
  'POST',
  ({ lang }) => ({ query: { lang } })
)

export default {
  getTask,
  submit
}
