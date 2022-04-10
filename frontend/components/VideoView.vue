<template lang="pug">
  #video-view.position-relative.flex-fill
    youtube(
      ref="youtube"
      :video-id="videoId"
      resize
      width="100%"
      height="100%"
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
      div(v-for="sub in activeSubs")
        span {{ sub.text }}
</template>

<script lang="ts">

import {
  defineComponent,
  ref,
  computed,
  PropType,
  toRefs,
} from '@nuxtjs/composition-api'

import {
  PlayerStates,
  YouTubePlayer,
} from '@/plugins/vue-youtube'

import { Sub } from '@/util/subtitle'

export default defineComponent({
  props: {
    videoId: { type: String, required: true },
    activeSubs: { type: Array as PropType<Sub[]>, required: true },
    changeState: { type: Function as PropType<(newState: PlayerStates) => void>, required: true },
    playing: { type: Function as PropType<() => void | null>, default: null },
    ready: { type: Function as PropType<() => void | null>, default: null },
    paused: { type: Function as PropType<() => void | null>, default: null   },
    ended: { type: Function as PropType<() => void | null>, default: null },
    buffering: { type: Function as PropType<() => void | null>, default: null },
    cued: { type: Function as PropType<() => void | null>, default: null },
  },
  setup(props) {
    const {
      changeState,
      playing,
      ready,
      paused,
      ended,
      buffering,
      cued,
    } = toRefs(props)

    const youtube = ref<HTMLElement & { player: YouTubePlayer } | null>(null)
    const player = computed(() => youtube.value?.player)

    // player events
    const onReady = async(_e: CustomEvent) => {
      changeState.value(await player.value?.getPlayerState() || PlayerStates.UNSTARTED)
      if (ready.value) ready.value()
    }
    const onPlaying = (_e: CustomEvent) => {
      changeState.value(PlayerStates.PLAYING)
      if (playing.value) playing.value()
    }
    const onPaused = (_e: CustomEvent) => {
      changeState.value(PlayerStates.PAUSED)
      if (paused.value) paused.value()
    }
    const onEnded = (_e: CustomEvent) => {
      changeState.value(PlayerStates.ENDED)
      if (ended.value) ended.value()
    }
    const onBuffering = (_e: CustomEvent) => {
      changeState.value(PlayerStates.BUFFERING)
      if (buffering.value) buffering.value()
    }
    const onCued = async(_e: CustomEvent) => {
      changeState.value(PlayerStates.VIDEO_CUED)
      if (cued.value) cued.value()
    }

    return {
      youtube,
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
#video-subs
  bottom: 0
  pointer-events: none
  span
    background-color: #000000BB
    border-radius: 5px
</style>
