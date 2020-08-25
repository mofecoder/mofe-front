import { Middleware } from '@nuxt/types'
import { getModule } from 'vuex-module-decorators'
import UserModule from '../store/user'

const middleware: Middleware = async ({ store, route, redirect }) => {
  const userModule = getModule(UserModule, store)
  await userModule.fetchUser()
  if (!userModule.getUser) {
    redirect('/login', {
      redirect: route.path
    })
  }
}

export default middleware
