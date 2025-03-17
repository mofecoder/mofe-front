import { Api } from '~/types/api'
import type {
  Contest,
  ContestCreateParam,
  ContestDetailManage,
  ContestEditParam
} from '~/types/contest'

const getContest = new Api<ContestDetailManage, [string]>(
  ([slug]) => `/api/manage/contests/${slug}`
)
const getContests = new Api<Contest[]>('/api/manage/contests', 'GET')

const createContest = new Api<Contest, [], ContestCreateParam>(
  '/api/contests',
  'POST'
)

const updateContest = new Api<Contest, [string], ContestEditParam>(
  ([slug]) => `/api/contests/${slug}`,
  'PUT'
)

const addTask = new Api<void, [string, number, string, string]>(
  ([contestSlug, problemId, problemSlug, position]) =>
    `/api/contests/${contestSlug}/set_task`
    + `?problem_id=${problemId}`
    + `&problem_slug=${problemSlug}`
    + `&position=${position}`,
  'PUT'
)

const removeTask = new Api<void, [string, string]>(
  ([contestSlug, problemSlug]) =>
    `/api/contests/${contestSlug}/tasks/${problemSlug}/remove_from_contest`,
  'PUT'
)

const addAdmin = new Api<void, [string], { userName: string }>(
  ([contestSlug]) => `/api/contests/${contestSlug}/contest_admins`,
  'POST'
)

const removeAdmin = new Api<void, [string], { userName: string }>(
  ([contestSlug]) => `/api/contests/${contestSlug}/contest_admins`,
  'DELETE'
)

export default {
  getContest,
  getContests,
  createContest,
  updateContest,
  addTask,
  removeTask,
  addAdmin,
  removeAdmin
}
