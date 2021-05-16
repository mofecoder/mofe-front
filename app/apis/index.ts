import ApiTasks from './Tasks'
import ApiContests from './Contests'
import ApiAuth from './Auth'
import ApiProblems from './Problems'
import ApiTestcases from './Testcases'
import ApiPosts from './Posts'
import ApiUsers from './Users'

export interface CafeCoderApi {
  Tasks: ApiTasks
  Contests: ApiContests
  Auth: ApiAuth
  Problems: ApiProblems
  Testcases: ApiTestcases
  Posts: ApiPosts
  Users: ApiUsers
}

const Contests = new ApiContests()
const Tasks = new ApiTasks()
const Auth = new ApiAuth()
const Problems = new ApiProblems()
const Testcases = new ApiTestcases()
const Posts = new ApiPosts()
const Users = new ApiUsers()

const exports: CafeCoderApi = {
  Tasks,
  Contests,
  Auth,
  Problems,
  Testcases,
  Posts,
  Users
}

export default exports
