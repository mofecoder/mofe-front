export interface AuthUser {
  id: number
  email: string
  name: string
  provider: string
  uid: string
  allowPasswordChange: boolean
  role: string
  atcoderId: string | null
  writerRequestCode: string | null
}
