import { Context } from '@nuxt/types'
import { getMe as getMeRoute } from '@/routes/user'

export default async({ store }: Context) => {
  await getMeRoute()().then(user => {
    store.commit('user/setUser', user.email)
  }).catch(err => {
    // eslint-disable-next-line no-console
    console.error(err)
  })
}
