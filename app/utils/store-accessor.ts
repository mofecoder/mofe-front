import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import ContestStore from '~/store/contest'

/* eslint-disable import/no-mutable-exports */
let contestStore: ContestStore

function initializeStores(store: Store<any>): void {
  contestStore = getModule(ContestStore, store)
}

export { initializeStores, contestStore }
