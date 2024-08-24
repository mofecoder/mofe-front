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

const getProblems = new Api<Problem[]>('/problems')

const getProblem = new Api<ProblemDetail, [number]>(([id]) => `/problems/${id}`)
const updateProblem = new Api<
  ProblemDetail,
  [number],
  { problem: ProblemParams }
>(([id]) => `/problems/${id}`, 'PUT')

const getUnsetProblems = new Api<AdminProblem[], []>(
  '/manage/problems/unset_problems'
)

const createProblem = new Api<ProblemDetail, [], { problem: ProblemParams }>(
  '/problems',
  'POST'
)

const addTester = new Api<void, [number]>(
  ([id]) => `/problems/${id}/tester_relations`,
  'POST'
)
const removeTester = new Api<void, [number]>(
  ([id]) => `/problems/${id}/tester_relations`,
  'DELETE'
)

const getTestcases = new Api<TestcasesResponseType, [number]>(
  ([id]) => `/problems/${id}/testcases`
)

const getTestcase = new Api<TestcaseResponseType, [number, number]>(
  ([id, testcaseId]) => `/problems/${id}/testcases/${testcaseId}`
)

const deleteTestcase = new Api<void, [number, number]>(
  ([id, testcaseId]) => `/problems/${id}/testcases/${testcaseId}`,
  'DELETE'
)

const createTestcase = new Api<void, [number]>(
  ([id]) => `/problems/${id}/testcases`,
  'POST'
)

const updateTestcase = new Api<void, [number, number]>(
  ([id, testcaseId]) => `/problems/${id}/testcases/${testcaseId}`,
  'PUT'
)

const getTestcaseSet = new Api<TestcaseSet, [number, number]>(
  ([id, testcaseSetId]) => `/problems/${id}/testcase_sets/${testcaseSetId}`
)

const deleteMultipleTestcases = new Api<
  void,
  [number],
  { testcases: number[] }
>(([id]) => `/problems/${id}/testcases/delete_multiple`, 'DELETE')

const createTestcaseSet = new Api<void, [number]>(
  ([id]) => `/problems/${id}/testcase_sets`,
  'POST'
)

const updateTestcaseSet = new Api<void, [number, number]>(
  ([id, testcaseSetId]) => `/problems/${id}/testcase_sets/${testcaseSetId}`,
  'PUT'
)

const deleteTestcaseSet = new Api<void, [number, number]>(
  ([id, testcaseSetId]) => `/problems/${id}/testcase_sets/${testcaseSetId}`,
  'DELETE'
)

const uploadTestcases = new Api<UploadResponseType, [number]>(
  ([id]) => `/problems/${id}/testcases/upload`,
  'POST',
  {}
)

const changeTestcaseState = new Api<void, [number, number]>(
  ([id, testcaseId]) => `/problems/${id}/testcases/${testcaseId}/change_state`,
  'PATCH'
)

const addToTestcaseSetMultiple = new Api<
  void,
  [number],
  { testcaseIds: number[]; testcaseSetId: number }
>(([id]) => `/problems/${id}/testcases/change_state_multiple`, 'PATCH')

const updateChecker = new Api<string, [number]>(
  ([id]) => `/problems/${id}/checker`,
  'POST',
  {}
)

const downlaodChecker = new Api<void, [number]>(
  ([id]) => `/problems/${id}/checker`,
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
  addToTestcaseSetMultiple
}
