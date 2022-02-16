<template lang="pug">
  #index.fill-screen.flex-column.middle-center.text-white
    span#title.display-1.my-5: strong YTCC
    template(v-if="loggedIn")
      div Logged in as {{ userEmail }}
      button.btn.btn-primary.m-2(@click="logout()") LOGOUT
      div Enter Video Link
      input(type="text" v-model="videoLink")
      button.btn.btn-primary.m-2(@click="newVideo()"): | CREATE
    template(v-else)
      form(action="http://localhost:1233/login/google" method="post")
        input.btn.btn-primary.m-2(type="submit" value="Login with Google")
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, useRouter, computed, useStore } from '@nuxtjs/composition-api'
// import { StoreState } from '@/store'

import { newVideo as newVideoRoute } from '@/routes/video'
import { StoreState } from '@/store'

export default defineComponent({
  setup() {
    const store = useStore() as StoreState
    const userStore = store.state.user
    const router = useRouter()

    const videoLink = ref('')
    const userEmail = computed(() => userStore.email)
    const loggedIn = computed(() => userStore.loggedIn)

    onMounted(() => {
    })

    const newVideo = () => {
      newVideoRoute()({ videoLink: videoLink.value }).then(res => {
        router.push('/edit?videoId=' + res._id)
      })
    }

    const logout = () => {
      store.dispatch('user/logout')
    }

    return { videoLink, userEmail, loggedIn, newVideo, logout }
  },
})
</script>

<style lang="sass" scoped>
#index
  background-color: #470024
#title
  font-weight: 900
</style>
