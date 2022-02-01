import { GetterTree, ActionTree, MutationTree } from 'vuex'
import login from '@/api/user/login'
import logout from '@/api/user/logout'

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
    login()({ email, password }).then(data => {
      commit('setUser', data.email)
    }).catch()
  },
  logout({ commit }) {
    logout()().then(_ => {
      commit('resetUser')
    }).catch()
  },
}
