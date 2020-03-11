import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import ContestStore from '~/store/contest'
import UserStore from '~/store/user'

/* eslint-disable import/no-mutable-exports */
let contestStore: ContestStore
let userStore: UserStore

function initializeStores(store: Store<any>): void {
  contestStore = getModule(ContestStore, store)
  userStore = getModule(UserStore, store)
}

export { initializeStores, contestStore, userStore }
