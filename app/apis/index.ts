import ApiTasks from './Tasks'
import ApiContests from './Contests'
import ApiAuth from './Auth'
import ApiProblems from './Problems'

export interface CafeCoderApi {
  Tasks: ApiTasks
  Contests: ApiContests
  Auth: ApiAuth,
  Problems: ApiProblems
}

const Contests = new ApiContests()
const Tasks = new ApiTasks()
const Auth = new ApiAuth()
const Problems = new ApiProblems()

const exports: CafeCoderApi = {
  Tasks,
  Contests,
  Auth,
  Problems
}

export default exports
