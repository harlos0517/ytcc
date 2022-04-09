<template lang="pug">
  .fill-screen.flex-column.position-relative.bg-dark.text-white
    #player.position-relative.flex-fill
      youtube(
        ref="youtube"
        :video-id="video ? video.handle : ''"
        resize
        width="100%"
        height="100%"
        :resizeDelay="1"
        fitParent
      )
      #video-subs.w-100.position-absolute.text-center.h3
        div(v-for="t in tracks")
          div(v-for="sub in t.subs.data.filter(x=>x.active).reverse()")
            span {{ sub.text }}
    ViewTrackFinder(
      v-if='showTrackFinder'
      :videoId="videoId"
      :tracks="tracks"
      :triggerTrackFinder="triggerTrackFinder"
      :addTrack="addTrack"
      :removeTrack="removeTrack"
    )
    button#track-finder-button.btn.btn-secondary.position-absolute.m-1(
      @click="triggerTrackFinder"
    ) Add Track
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  onMounted,
  useRoute,
  useContext,
  useRouter,
} from '@nuxtjs/composition-api'

import { Video } from '@api/video'

import {
  getVideoById as getVideoByIdRoute,
} from '@/routes/video'
import {
  getTrack as getTrackRoute,
  getTrackInfos as getTrackInfosRoute,
} from '@/routes/track'

import {
  YouTubePlayer,
} from '@/plugins/vue-youtube'

import { Subtitles, SubTrack } from '@/util/subtitle'

export default defineComponent({
  setup() {
    const route = useRoute()
    const router = useRouter()
    const videoId = route.value.query.videoId as string
    const video = ref<Video | null>(null)
    const { $api } = useContext()

    const youtube = ref<HTMLElement & { player: YouTubePlayer } | null>(null)
    const player = computed(() => youtube.value?.player)
    const cursor = ref(0)

    const tracks = ref<SubTrack[]>([])

    const showTrackFinder = ref(false)

    const tracksInit = async() => {
      try {
        video.value = await $api(getVideoByIdRoute(videoId))()
      } catch (err) {
        if (err === 'Not Authenticated') {
          router.push('/')
          return
        }
      }
    }

    const addTrack = async(trackId: string) => {
      if (!trackId) return
      const t = tracks.value.find(t => t._id === trackId)
      if (t) return
      const track = await $api(getTrackRoute(trackId))()
      const infos = await $api(getTrackInfosRoute(trackId))()
      tracks.value.push({ ...track, subs: Subtitles.fromInfos(infos) })
    }

    const removeTrack = async(trackId: string) => {
      if (!trackId) return
      const index = tracks.value.findIndex(t => t._id === trackId)
      if (index >= 0) tracks.value.splice(index, 1)
    }

    const triggerTrackFinder = () => {
      showTrackFinder.value = !showTrackFinder.value
    }

    const setSubActive = () => {
      // TODO : OPT ALGO
      tracks.value.forEach(t => t.subs.setActive(cursor.value))
    }
    const updateCursor = async() => {
      cursor.value = await player.value?.getCurrentTime() || 0
    }

    const update = () => {
      updateCursor()
      setSubActive()
      window.requestAnimationFrame(update)
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    onMounted(() => {
      tracksInit()
      update()
    })

    return {
      videoId,
      youtube,
      video,
      tracks,
      showTrackFinder,
      addTrack,
      removeTrack,
      triggerTrackFinder,
    }
  },
})
</script>

<style lang="sass" scoped>
#video-subs
  bottom: 0
  pointer-events: none
  span
    background-color: #000000BB
    border-radius: 5px
#track-finder-button
  right: 1.5rem
  top: 4rem
</style>
