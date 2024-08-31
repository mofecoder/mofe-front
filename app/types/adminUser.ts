export interface User {
  id: number
  name: string
  role: 'admin' | 'writer' | 'member'
  createdAt: string
  writerRequestCode: string | null
  currentSignInAt: string
  atcoderId: string | null
  atcoderRating: number | null
}
