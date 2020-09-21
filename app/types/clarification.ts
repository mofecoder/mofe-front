export interface Clarification {
  id: number
  user: string
  task: { position: string; name: string; slug: string } | null
  question: string
  answer: string | null
  publish: boolean
  canAnswer: boolean
  createdAt: Date
  updatedAt: Date
}
