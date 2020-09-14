import { Middleware } from '@nuxt/types'
import { getModule } from 'vuex-module-decorators'
import UserModule from '../store/user'

const middleware: Middleware = async ({ store }) => {
  const userModule = getModule(UserModule, store)
  await userModule.fetchUser()
}

export default middleware
