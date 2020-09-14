import {
  httpDelete,
  httpGet,
  httpPatch,
  httpPost,
  httpPut
} from '~/utils/axios'
import { Testcase, TestcaseSet } from '~/types/problems'
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

export default class {
  async index(problemId: number) {
    const res = await httpGet<TestcasesResponseType>(
      `/problems/${problemId}/testcases/`
    )
    return res
  }

  async show(problemId: number, testcaseId: number) {
    const res = await httpGet<TestcaseResponseType>(
      `/problems/${problemId}/testcases/${testcaseId}`
    )
    return res
  }

  async delete(problemId: number, testcaseId: number) {
    await httpDelete(`/problems/${problemId}/testcases/${testcaseId}`)
  }

  async destroy(
    problemId: number,
    params: {
      name: string
      input: string
      output: string
      explanation: string
    }
  ) {
    await httpPost(`/problems/${problemId}/testcases`, {}, { testcase: params })
  }

  async showTestcaseSet(problemId: number, testcaseSetId: number) {
    const res = await httpGet<TestcaseSet>(
      `problems/${problemId}/testcase_sets/${testcaseSetId}`
    )
    return res
  }

  async createTestcaseSet(
    problemId: number,
    params: {
      name: string
      points: number
    }
  ) {
    await httpPost(
      `problems/${problemId}/testcase_sets`,
      {},
      { testcaseSet: params }
    )
  }

  async updateTestcaseSet(
    problemId: number,
    testcaseSetId: number,
    params: {
      name: string
      points: number
    }
  ) {
    await httpPut(
      `problems/${problemId}/testcase_sets/${testcaseSetId}`,
      {},
      { testcaseSet: params }
    )
  }

  async destroyTestcaseSet(problemId: number, testcaseSetId: number) {
    await httpDelete(`problems/${problemId}/testcase_sets/${testcaseSetId}`)
  }

  async uploadTestcases(
    problemId: number,
    file: File
  ): Promise<UploadResponseType> {
    const form = new FormData()
    form.append('file', file)
    const res = await httpPost<UploadResponseType>(
      `/problems/${problemId}/testcases/upload`,
      {},
      form,
      true,
      2 * 60 * 1000
    )
    return res
  }

  async changeTestcaseState(
    problemId: number,
    testcaseId: number,
    testcaseSetId: number,
    state: boolean
  ) {
    await httpPatch(
      `/problems/${problemId}/testcases/${testcaseId}/change_state`,
      {},
      { testcaseSetId, state }
    )
  }
}
