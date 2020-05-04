import ApiTasks from './Tasks'
import ApiContests from './Contests'
import ApiAuth from './Auth'
import ApiProblems from './Problems'
import ApiTestcases from './Testcases'

export interface CafeCoderApi {
  Tasks: ApiTasks
  Contests: ApiContests
  Auth: ApiAuth
  Problems: ApiProblems
  Testcases: ApiTestcases
}

const Contests = new ApiContests()
const Tasks = new ApiTasks()
const Auth = new ApiAuth()
const Problems = new ApiProblems()
const Testcases = new ApiTestcases()

const exports: CafeCoderApi = {
  Tasks,
  Contests,
  Auth,
  Problems,
  Testcases
}

export default exports
