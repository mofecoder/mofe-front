import { Task } from '~~/types/task'
import { Task as ManageProblem } from '~~/types/contestAdmin'

export interface Contest {
  slug: string
  name: string
  kind: 'normal' | 'private'
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
  writtenTasks: {
    slug: string
    id: number
    role: 'admin' | 'writer' | 'tester'
  }[]
  isAdmin: boolean
  standingsMode: 'icpc' | 'atcoder'
}

export interface ContestDetailManage extends ContestDetail {
  tasks: ManageProblem[]
  officialMode: boolean
}

export interface ContestCreateParam extends Contest {
  description: string
  penaltyTime: number
}

export interface ContestEditParam {
  name?: string
  kind?: Contest['kind']
  startAt?: string
  endAt?: string
  description?: string
  penaltyTime?: number
  editorialUrl?: string
  officialMode?: boolean
  standingsMode?: 'icpc' | 'atcoder'
}
