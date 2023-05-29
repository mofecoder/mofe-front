import { Api } from '~/types/api'
import { Contest } from '~/types/contest'

const getContests = new Api<Contest[]>('/contests')
export default { getContests }
