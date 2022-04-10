<template lang="pug">
  .fill-screen.flex-column.position-relative.bg-dark.text-white
    VideoView(
      ref="playerRef"
      :videoId="video ? video.handle : ''"
      :activeSubs="activeSubs"
      :changeState="() => {}"
    )
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

    const playerRef = ref<(HTMLElement & { player: YouTubePlayer }) | null>(null)
    const player = computed(() => playerRef.value?.player)

    const cursor = ref(0)

    const tracks = ref<SubTrack[]>([])
    const activeSubs = computed(
      () => tracks.value.map(t => t.subs.data.filter(x => x.active).reverse()).flat(),
    )
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
      playerRef,
      player,
      video,
      tracks,
      activeSubs,
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
