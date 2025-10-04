import { Api } from '~/types/api'
import type { User } from '~/types/adminUser'

const getUsers = new Api<User[], []>('v1', '/api/users')

const updateUser = new Api<void, [number], Pick<User, 'role'>>('v1',
  ([id]) => `/api/users/${id}/update_admin`,
  'PATCH'
)

const updateRating = new Api<ReadableStream, []>('v1', '/api/users/update_rating', 'POST')

export default {
  getUsers,
  updateUser,
  updateRating
}
