export interface Post {
  id: number
  title: string
  content: string
  publicStatus: 'private' | 'public' | 'limited'
  createdAt: Date
  updatedAt: Date
}
