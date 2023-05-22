import { httpGet, httpPatch, httpPost } from '../utils/axios'
import { User } from '../types/adminUser'

export default class {
  async index() {
    return await httpGet<User[]>('/users')
  }

  async update(userId: number, payload: Pick<User, 'role'>) {
    return await httpPatch(`/users/${userId}/update_admin`, {}, payload)
  }

  async generateWriterRequestCode(userId: number) {
    return await httpPost(`/users/${userId}/generate_writer_request_code`)
  }
}
