import { GetterTree, ActionTree, MutationTree } from 'vuex'
import { getMe, login, loginGoogle, logout } from '@/routes/user'

export type UserState = {
  loggedIn: boolean
  email: string
}

export const state = () => ({
  loggedIn: false,
  email: '',
} as UserState)

export const getters: GetterTree<UserState, UserState> = {
  email: state => state.email,
  loggedIn: state => state.loggedIn,
}

export const mutations: MutationTree<UserState> = {
  setUser: (state, email: string) => {
    state.email = email
    state.loggedIn = true
  },
  resetUser: state => {
    state.email = ''
    state.loggedIn = false
  },
}

export const actions: ActionTree<UserState, UserState> = {
  login({ commit }, { email, password }) {
    login()({ email, password }).then(_ => {
      commit('setUser', email)
    }).catch()
  },
  loginGoogle({ commit }) {
    loginGoogle()().then(async _ => {
      const user = await getMe()()
      commit('setUser', user.email)
    }).catch()
  },
  logout({ commit }) {
    logout()().then(_ => {
      commit('resetUser')
    }).catch()
  },
}
