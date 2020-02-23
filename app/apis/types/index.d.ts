import { ApiProblems } from './Problems'
import { ApiContests } from '~/apis/types/Contests'

interface CafeCoderApi {
  Problems: ApiProblems
  Contests: ApiContests
}
