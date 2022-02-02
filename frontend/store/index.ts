import { Store } from 'vuex'

import { UserState } from './user'

export type State = {
  user: UserState
}

export type StoreState = Store<State>
