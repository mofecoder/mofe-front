import ApiTasks from './Tasks'
import ApiContests from './Contests'

export interface CafeCoderApi {
  Tasks: ApiTasks
  Contests: ApiContests
}

const Contests = new ApiContests()
const Tasks = new ApiTasks()

const exports: CafeCoderApi = {
  Tasks,
  Contests
}

export default exports
