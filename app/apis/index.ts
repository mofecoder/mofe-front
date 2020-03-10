import ApiProblems from './Problems'
import ApiContests from './Contests'
import ApiAuth from './Auth'

export interface CafeCoderApi {
  Problems: ApiProblems
  Contests: ApiContests
  Auth: ApiAuth
}

const Contests = new ApiContests()
const Problems = new ApiProblems()
const Auth = new ApiAuth()

const exports: CafeCoderApi = {
  Problems,
  Contests,
  Auth
}

export default exports
