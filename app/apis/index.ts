import ApiProblems from './Problems'
import ApiContests from './Contests'

export interface CafeCoderApi {
  Problems: ApiProblems
  Contests: ApiContests
}

const Contests = new ApiContests()
const Problems = new ApiProblems()

const exports: CafeCoderApi = {
  Problems,
  Contests
}

export default exports
