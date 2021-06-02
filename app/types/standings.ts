type ProblemScore = {
  score?: number
  time?: number
  penalty?: number | null
}

type StandingUser = {
  name: string
  atcoderId: string | null
  atcoderRating: number | null
}

export interface Standing {
  rank: number
  user: StandingUser
  result: ProblemScore
  problems: ProblemScore[]
}

export interface StandingProblem {
  position: string
  name: string | null
  slug: string
  solved: number
  tried: number
  firstAccept: { user: StandingUser; time: number } | null
}

export interface StandingData {
  problems: StandingProblem[]
  standings: Standing[]
}
