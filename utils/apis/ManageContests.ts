import { Api } from '~/types/api'
import type {
  Contest,
  ContestCreateParam,
  ContestDetailManage,
  ContestEditParam
} from '~/types/contest'

const getContest = new Api<ContestDetailManage, [string]>(
  ([slug]) => `/manage/contests/${slug}`
)
const getContests = new Api<Contest[]>('/manage/contests', 'GET')

const createContest = new Api<Contest, [], ContestCreateParam>(
  '/contests',
  'POST'
)

const updateContest = new Api<Contest, [string], ContestEditParam>(
  ([slug]) => `/contests/${slug}`,
  'PUT'
)

const addTask = new Api<void, [string, number, string, string]>(
  ([contestSlug, problemId, problemSlug, position]) =>
    `/contests/${contestSlug}/set_task` +
    `?problem_id=${problemId}` +
    `&problem_slug=${problemSlug}` +
    `&position=${position}`,
  'PUT'
)

const removeTask = new Api<void, [string, string]>(
  ([contestSlug, problemSlug]) =>
    `/contests/${contestSlug}/tasks/${problemSlug}/remove_from_contest`,
  'PUT'
)

const addAdmin = new Api<void, [string], { userName: string }>(
  ([contestSlug]) => `/contests/${contestSlug}/contest_admins`,
  'POST'
)

const removeAdmin = new Api<void, [string], { userName: string }>(
  ([contestSlug]) => `/contests/${contestSlug}/contest_admins`,
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
