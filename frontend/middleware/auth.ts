import { Context } from '@nuxt/types'
import { getMe as getMeRoute } from '@/routes/user'

export default async({ store }: Context) => {
  const { email } = await getMeRoute()()
  store.commit('user/setUser', email)
}
