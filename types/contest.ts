import type { Task } from '~~/types/task'
import type { Task as ManageProblem } from '~~/types/contestAdmin'

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
  registered: string | null
  editorial: string | null
  writtenTasks: {
    slug: string
    id: number
    role: 'admin' | 'writer' | 'tester'
  }[]
  isAdmin: boolean
  standingsMode: 'icpc' | 'atcoder'
  registrationRestriction: boolean
  allowOpenRegistration: boolean
}

export interface ContestDetailManage extends ContestDetail {
  tasks: ManageProblem[]
  officialMode: boolean
}

export interface ContestCreateParam extends Contest {
  description: string
  penaltyTime: number
  standingsMode: 'icpc' | 'atcoder'
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
