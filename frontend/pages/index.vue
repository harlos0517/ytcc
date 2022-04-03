<template lang="pug">
  #index.fill-screen.flex-column.middle-center.text-white
    span#title.display-1.my-5: strong YTCC
    .container.text-center(v-if="loggedIn")
      div Logged in as {{ userEmail }}
      .my-2
        Nuxt-link.btn.btn-primary.mr-2(to="/me") MY TRACKS
        button.btn.btn-primary(@click="logout()") LOGOUT
      div.my-3 Enter Video Link
        input.w-100(type="text" v-model="videoLink")
      button.btn.btn-primary.mr-2(@click="toVideoPage('edit')") CREATE
      button.btn.btn-primary(@click="toVideoPage('view')") WATCH WITH CC
    template(v-else)
      form(:action="googleLoginUrl" method="post")
        input.btn.btn-primary.m-2(type="submit" value="Login with Google")
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  useRouter,
  computed,
  useStore,
  useContext,
} from '@nuxtjs/composition-api'
// import { StoreState } from '@/store'

import { newVideo as newVideoRoute } from '@/routes/video'
import { StoreState } from '@/store'

export default defineComponent({
  setup() {
    const store = useStore() as StoreState
    const userStore = store.state.user
    const router = useRouter()
    const { $api } = useContext()

    const videoLink = ref('')
    const userEmail = computed(() => userStore.email)
    const loggedIn = computed(() => userStore.loggedIn)

    const googleLoginUrl = `${useContext().$config.apiHost}/login/google`

    const toVideoPage = (page: string) => {
      $api(newVideoRoute())({ videoLink: videoLink.value }).then(res => {
        router.push(`/${page}?videoId=${res._id}`)
      })
    }

    const logout = () => {
      store.dispatch('user/logout')
    }

    return { videoLink, userEmail, loggedIn, toVideoPage, logout, googleLoginUrl }
  },
})
</script>

<style lang="sass" scoped>
#index
  background-color: #470024
#title
  font-weight: 900
</style>
