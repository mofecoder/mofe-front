export interface User {
  id: number
  name: string
  role: 'admin' | 'writer' | 'member'
  createdAt: string
}
