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
  rank: number
  user: {
    name: string
    atcoderName: string | null
    atcoderRating: number | null
  }
  result: ProblemScore
  problems: ProblemScore[]
}

export interface StandingProblem {
  position: string
  name: string
  slug: string
  solved: number
  tried: number
}
