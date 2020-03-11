import ApiTasks from './Tasks'
import ApiContests from './Contests'
import ApiAuth from './Auth'

export interface CafeCoderApi {
  Tasks: ApiTasks
  Contests: ApiContests
  Auth: ApiAuth
}

const Contests = new ApiContests()
const Tasks = new ApiTasks()
const Auth = new ApiAuth()

const exports: CafeCoderApi = {
  Tasks,
  Contests,
  Auth
}

export default exports
