import { Api } from '~/types/api'
import type {
  Problem,
  ProblemDetail,
  ProblemParams,
  Testcase,
  TestcaseSet
} from '~/types/problems'
import type { Problem as AdminProblem } from '~/types/contestAdmin'

type UploadResponseType = { messages: string[] }
type TestcasesResponseType = {
  testcaseSets: TestcaseSet[]
  testcases: Testcase[]
}
type TestcaseResponseType = {
  id: number
  name: string
  input: string
  output: string
  explanation: string | null
}

const getProblems = new Api<Problem[]>('/api/problems')

const getProblem = new Api<ProblemDetail, [number]>(([id]) => `/api/problems/${id}`)
const updateProblem = new Api<
  ProblemDetail,
  [number],
  { problem: ProblemParams }
>(([id]) => `/api/problems/${id}`, 'PUT')

const getUnsetProblems = new Api<AdminProblem[], []>(
  '/api/manage/problems/unset_problems'
)

const createProblem = new Api<ProblemDetail, [], { problem: ProblemParams }>(
  '/api/problems',
  'POST'
)

const addTester = new Api<void, [number]>(
  ([id]) => `/api/problems/${id}/tester_relations`,
  'POST'
)
const removeTester = new Api<void, [number]>(
  ([id]) => `/api/problems/${id}/tester_relations`,
  'DELETE'
)

const getTestcases = new Api<TestcasesResponseType, [number]>(
  ([id]) => `/api/problems/${id}/testcases`
)

const getTestcase = new Api<TestcaseResponseType, [number, number]>(
  ([id, testcaseId]) => `/api/problems/${id}/testcases/${testcaseId}`
)

const deleteTestcase = new Api<void, [number, number]>(
  ([id, testcaseId]) => `/api/problems/${id}/testcases/${testcaseId}`,
  'DELETE'
)

const createTestcase = new Api<void, [number]>(
  ([id]) => `/api/problems/${id}/testcases`,
  'POST'
)

const updateTestcase = new Api<void, [number, number]>(
  ([id, testcaseId]) => `/api/problems/${id}/testcases/${testcaseId}`,
  'PUT'
)

const getTestcaseSet = new Api<TestcaseSet, [number, number]>(
  ([id, testcaseSetId]) => `/api/problems/${id}/testcase_sets/${testcaseSetId}`
)

const deleteMultipleTestcases = new Api<
  void,
  [number],
  { testcases: number[] }
>(([id]) => `/api/problems/${id}/testcases/delete_multiple`, 'DELETE')

const createTestcaseSet = new Api<void, [number]>(
  ([id]) => `/api/problems/${id}/testcase_sets`,
  'POST'
)

const updateTestcaseSet = new Api<void, [number, number]>(
  ([id, testcaseSetId]) => `/api/problems/${id}/testcase_sets/${testcaseSetId}`,
  'PUT'
)

const deleteTestcaseSet = new Api<void, [number, number]>(
  ([id, testcaseSetId]) => `/api/problems/${id}/testcase_sets/${testcaseSetId}`,
  'DELETE'
)

const uploadTestcases = new Api<UploadResponseType, [number]>(
  ([id]) => `/api/problems/${id}/testcases/upload`,
  'POST',
  {}
)

const changeTestcaseState = new Api<void, [number, number]>(
  ([id, testcaseId]) => `/api/problems/${id}/testcases/${testcaseId}/change_state`,
  'PATCH'
)

const addToTestcaseSetMultiple = new Api<
  void,
  [number],
  { testcaseIds: number[], testcaseSetId: number }
>(([id]) => `/api/problems/${id}/testcases/change_state_multiple`, 'PATCH')

const updateChecker = new Api<string, [number]>(
  ([id]) => `/api/problems/${id}/checker`,
  'POST',
  {}
)

const downloadChecker = new Api<string, [number]>(
  ([id]) => `/api/problems/${id}/checker`,
  'GET',
  {}
)

export default {
  getProblems,
  getProblem,
  getUnsetProblems,
  updateProblem,
  createProblem,
  addTester,
  removeTester,
  getTestcases,
  getTestcase,
  deleteTestcase,
  createTestcase,
  updateTestcase,
  deleteMultipleTestcases,
  getTestcaseSet,
  createTestcaseSet,
  updateTestcaseSet,
  deleteTestcaseSet,
  uploadTestcases,
  changeTestcaseState,
  updateChecker,
  addToTestcaseSetMultiple,
  downloadChecker
}
