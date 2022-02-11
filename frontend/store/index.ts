import { Store } from 'vuex'

import { UserState } from '@/store/user'

export type State = {
  user: UserState
}

export type StoreState = Store<State>
