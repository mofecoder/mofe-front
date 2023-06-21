import { Api } from '~/types/api'
import { User } from '~/types/adminUser'

const getUsers = new Api<User[], []>('/users')

const updateUser = new Api<void, [number], Pick<User, 'role'>>(
  ([id]) => `/users/${id}/update_admin`,
  'PATCH'
)

const updateRating = new Api<void, []>('/users/update_rating', 'POST')

export default {
  getUsers,
  updateUser,
  updateRating
}
