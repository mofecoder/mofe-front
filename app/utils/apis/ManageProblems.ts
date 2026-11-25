import type { FetchOptions } from 'ofetch'
import type {
  AggregateType,
  Problem,
  ProblemDetail,
  ProblemParams,
  Testcase,
  TestcaseSet
} from '~/types/problems'
import type { Problem as AdminProblem } from '~/types/contestAdmin'

export type TestcasesResponse = {
  testcaseSets: TestcaseSet[]
  testcases: Testcase[]
}
export type TestcaseParams = {
  name: string
  input: string
  output: string
  explanation: string | null
}
export type TestcaseResponse = TestcaseParams & { id: number }
export type TestcaseSetParams = {
  name: string
  points: string
  aggregateType: AggregateType
}

// 呼び出し側から渡せるリクエストの追加オプション
type RequestOptions = Pick<FetchOptions, 'signal' | 'retry' | 'timeout'>

export const manageProblemsApi = () => {
  const api = useNuxtApp().$api
  return {
    list: () => api<Problem[]>('/problems'),
    unsetProblems: () =>
      api<AdminProblem[]>('/manage/problems/unset_problems'),
    get: (id: number) => api<ProblemDetail>(`/problems/${id}`),
    create: (body: { problem: ProblemParams }) =>
      api<ProblemDetail>('/problems', { method: 'POST', body }),
    update: (id: number, body: { problem: ProblemParams }) =>
      api<ProblemDetail>(`/problems/${id}`, { method: 'PUT', body }),

    addTester: (id: number, body: { userName: string }) =>
      api<unknown>(`/problems/${id}/tester_relations`, { method: 'POST', body }),
    removeTester: (id: number, body: { userName: string }) =>
      api<unknown>(`/problems/${id}/tester_relations`, {
        method: 'DELETE',
        body
      }),

    testcases: (id: number) =>
      api<TestcasesResponse>(`/problems/${id}/testcases`),
    testcase: (p: { problemId: number; testcaseId: number }) =>
      api<TestcaseResponse>(
        `/problems/${p.problemId}/testcases/${p.testcaseId}`
      ),
    createTestcase: (id: number, body: TestcaseParams) =>
      api<unknown>(`/problems/${id}/testcases`, { method: 'POST', body }),
    updateTestcase: (
      p: { problemId: number; testcaseId: number },
      body: TestcaseParams
    ) =>
      api<unknown>(`/problems/${p.problemId}/testcases/${p.testcaseId}`, {
        method: 'PUT',
        body
      }),
    deleteTestcase: (p: { problemId: number; testcaseId: number }) =>
      api<unknown>(`/problems/${p.problemId}/testcases/${p.testcaseId}`, {
        method: 'DELETE'
      }),
    deleteTestcases: (id: number, body: { testcases: number[] }) =>
      api<unknown>(`/problems/${id}/testcases/delete_multiple`, {
        method: 'DELETE',
        body
      }),
    uploadTestcases: (id: number, form: FormData, opts: RequestOptions = {}) =>
      api<{ messages: string[] }>(`/problems/${id}/testcases/upload`, {
        method: 'POST',
        body: form,
        ...opts
      }),
    changeTestcaseState: (
      p: { problemId: number; testcaseId: number },
      body: { testcaseSetId: number; state: boolean }
    ) =>
      api<unknown>(
        `/problems/${p.problemId}/testcases/${p.testcaseId}/change_state`,
        { method: 'PATCH', body }
      ),
    addToTestcaseSet: (
      id: number,
      body: { testcaseIds: number[]; testcaseSetId: number }
    ) =>
      api<unknown>(`/problems/${id}/testcases/change_state_multiple`, {
        method: 'PATCH',
        body
      }),

    testcaseSet: (p: { problemId: number; testcaseSetId: number }) =>
      api<TestcaseSet>(
        `/problems/${p.problemId}/testcase_sets/${p.testcaseSetId}`
      ),
    createTestcaseSet: (id: number, body: TestcaseSetParams) =>
      api<unknown>(`/problems/${id}/testcase_sets`, { method: 'POST', body }),
    updateTestcaseSet: (
      p: { problemId: number; testcaseSetId: number },
      body: TestcaseSetParams
    ) =>
      api<unknown>(`/problems/${p.problemId}/testcase_sets/${p.testcaseSetId}`, {
        method: 'PUT',
        body
      }),
    deleteTestcaseSet: (p: { problemId: number; testcaseSetId: number }) =>
      api<unknown>(`/problems/${p.problemId}/testcase_sets/${p.testcaseSetId}`, {
        method: 'DELETE'
      }),

    // FormData (type / file) で送る
    updateChecker: (id: number, form: FormData) =>
      api<string>(`/problems/${id}/checker`, { method: 'POST', body: form }),
    downloadChecker: (id: number) =>
      api<string>(`/problems/${id}/checker`, { responseType: 'text' })
  }
}
