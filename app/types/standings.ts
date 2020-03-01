type ProblemScore = {
  score?: number
  time?: number
  penalty?: number | null
}

export interface StandingData {
  problems: StandingProblem[]
  standings: Standing[]
}

export interface Standing {
  userName: string
  result: ProblemScore
  problems: ProblemScore[]
}

export interface StandingProblem {
  name: string
  slug: string
  solved: number
  tried: number
}
