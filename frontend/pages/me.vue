<template lang="pug">
  #me
    .container.py-5
      h1 My Tracks
      .row.mb-3
        .col
          span.mr-3 E-mail: {{ userEmail }}
          button.btn.btn-primary(@click="logout()") LOGOUT
      .row
        .col-4(v-for="video in videos")
          nuxt-link(:to="'/edit?videoId=' + video._id")
            b-card.video-tiem.bg-dark(
              :img-src="video.thumbnail"
              img-top
            )
              b-card-title {{ video.title }}
              nuxt-link(:to="'/view?videoId=' + video._id")
                button.btn.btn-primary WATCH WITH CC

</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  ref,
  useContext,
  useRouter,
  useStore,
} from '@nuxtjs/composition-api'
import { StoreState } from '@/store'

import { Video } from '@/../api/src/video'
import { getMyVideos } from '@/routes/video'

type VideoInfo = Video & { title: string, thumbnail: string }

export default defineComponent({
  setup() {
    const store = useStore() as StoreState
    const userStore = store.state.user
    const router = useRouter()
    const { $api, $axios } = useContext()

    const userEmail = computed(() => userStore.email)
    const loggedIn = computed(() => userStore.loggedIn)
    const videos = ref<VideoInfo[]>([])

    const logout = () => {
      store.dispatch('user/logout')
      router.push('/')
    }

    onMounted(async() => {
      if (!loggedIn.value) {
        router.push('/')
        return
      }
      const myVideos: Video[] = await $api(getMyVideos())()
      videos.value = await Promise.all(myVideos.map(async video => {
        const youtubeData = await $axios(`http://youtube.com/oembed?url=youtube.com/watch?v=${video.handle}&format=json`)
        return {
          ...video,
          title: youtubeData.data.title || '',
          thumbnail: youtubeData.data.thumbnail_url || '',
        }
      }))
    })

    return {
      userEmail,
      loggedIn,
      videos,
      logout,
    }
  },
})
</script>

<style lang="sass" scoped>
#me
  background-color: #470024
  color: white
  min-height: 100vh
  .card:hover
    background-color: #555!important
  a
    color: inherit
</style>
