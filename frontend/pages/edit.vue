<template lang="pug">
  .w-100.vh-100.d-flex.flex-column.bg-dark.text-white

    #top: EditHeader

    #mid.flex-fill.d-flex.flex-row.align-items-stretch.position-relative
      #video.d-flex.flex-column
        #player.position-relative.flex-fill
          youtube(
            ref="youtube"
            video-id="Jt-5wQroOXA"
            resize
            :resizeDelay="1"
            fitParent
            @playing="onPlaying"
            @ready="onReady"
            @paused="onPaused"
            @ended="onEnded"
            @buffering="onBuffering"
            @cued="onCued"
          )
          #video-subs.w-100.position-absolute.text-center.h3
        EditTimeline(:videoLength="videoLength" :player="player")
      #subtitle
    #bot.d-flex.flex-row.align-items-center
      span {{ infoText }}
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  defineComponent,
  ref,
  computed,
  onMounted,
} from '@nuxtjs/composition-api'
import { mapStateString, PlayerState, YouTubePlayer } from '~/components/edit/youtube-player'

class Subtitles {
  data: Array<any>

  constructor(data?: Array<any>) {
    this.data = []
    if (data && !Array.isArray(data))
      throw new TypeError('Subtitle Data must be an array.')
    if (data) data.forEach(this.insert.bind(this))
  }

  insert(sub: any) {
    if (!sub) throw new Error('Inserting empty data.')
    const newSub: any = {
      start: sub.startTime || sub.start || sub.s,
      end: sub.endTime || sub.end || sub.e,
      text: sub.text || sub.txt || sub.t || '',
    }
    if (isNaN(newSub.start)) throw new TypeError('Invalid start time.')
    if (isNaN(newSub.end)) throw new TypeError('Invalid end time.')
    if (typeof newSub.text !== 'string') throw new TypeError('Invalid text.')

    let prevSub = null
    let thisSub = this.data[0] || null
    let i = 0
    while (thisSub && thisSub.end <= newSub.end) {
      prevSub = thisSub
      thisSub = thisSub.next
      i++
    }

    if (thisSub) newSub.end = Math.min(newSub.end, thisSub.start)
    const start = prevSub ? prevSub.end : 0
    newSub.start = Math.max(start, newSub.start)
    if (newSub.end - newSub.start < 0.1)
      throw new Error('Time segment too small.')

    newSub.next = thisSub
    newSub.prev = prevSub
    if (prevSub) prevSub.next = newSub
    if (thisSub) thisSub.prev = newSub
    this.data.splice(i, 0, newSub)
  }

  delete(sub: any) {
    const i = this.data.findIndex(s => s === sub)
    if (i < 0) throw new Error('This sub does not exist on this Subtitles.')
    if (sub.next) sub.next.prev = sub.prev
    if (sub.prev) sub.prev.next = sub.next
    this.data.splice(i, 1)
  }
}

export default defineComponent({
  setup() {
    // const store = useStore() as StoreState

    const youtube = ref<HTMLElement & { player: YouTubePlayer } | null>(null)
    const videoId = ref('')
    const videoIdInput = ref('')
    const subtitles = ref(new Subtitles())
    const tracks = ref([])
    const curTrack = ref(0)
    const state = ref(undefined as PlayerState | undefined)
    const curSub = ref(0)
    const mousePosition = ref({ x: 0, y: 0 })
    const showHelp = ref(false)
    const curVersion = ref('1.0.0')
    const infoText = ref('')
    const videoLength = ref(60)

    const player = computed(() => youtube.value?.player)

    const onReady = async(e: CustomEvent | any) => {
      state.value = await player.value?.getPlayerState()
      videoLength.value = await player.value?.getDuration() || 60
      infoText.value = mapStateString(state.value)
    }
    const onPlaying = (e: CustomEvent | any) => {
      state.value = PlayerState.PLAYING
      infoText.value = mapStateString(state.value)
    }
    const onPaused = (e: CustomEvent | any) => {
      state.value = PlayerState.PAUSED
      infoText.value = mapStateString(state.value)
    }
    const onEnded = (e: CustomEvent | any) => {
      state.value = PlayerState.ENDED
      infoText.value = mapStateString(state.value)
    }
    const onBuffering = (e: CustomEvent | any) => {
      state.value = PlayerState.BUFFERING
      infoText.value = mapStateString(state.value)
    }
    const onCued = (e: CustomEvent | any) => {
      state.value = PlayerState.VIDEO_CUED
      infoText.value = mapStateString(state.value)
    }

    onMounted(() => {})

    return {
      youtube,
      state,
      infoText,
      videoLength,
      player,
      onReady,
      onPlaying,
      onPaused,
      onEnded,
      onBuffering,
      onCued,
    }
  },
})
</script>

<style lang="sass" scoped>
#video
  flex: 3 0 0
#subtitle
  flex: 1 0 0
</style>
