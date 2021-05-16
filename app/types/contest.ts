import { Task } from '~/types/task'
import { Task as ManageProblem } from '~/types/contestAdmin'

export interface Contest {
  slug: string
  name: string
  startAt: string
  endAt: string
}

export interface ContestDetail extends Contest {
  tasks?: Task[]
  description: string
  penaltyTime: number
  isWriterOrTester: boolean
  registered: boolean
  editorial: string | null
  writtenTasks: string[]
}

export interface ContestDetailManage extends ContestDetail {
  tasks: ManageProblem[]
}

export interface ContestCreateParam {
  name: string
  slug: string
  startAt: string
  endAt: string
  description: string
  penaltyTime: number
}

export interface ContestEditParam {
  name?: string
  startAt?: string
  endAt?: string
  description?: string
  penaltyTime?: number
  editorialUrl?: string
}
