<template lang="pug">
  #track-finder.position-absolute.rounded
    .wrap.p-5
      .row.mb-3.mx-0
        div.col.px-0
          select.w-100.h-100(v-model="selectedTrackId")
            option(value="") Please Select
            option(v-for="track in trackList" :value="track._id") {{ track.name }}
        div.col-auto.px-0
          button.btn.btn-primary(@click="addTrack(selectedTrackId)") ADD
      .row.mb-3(v-for="track in tracks")
        div.col.d-flex.align-items-center
          span {{ track.name }}
        div.col-auto
          button.btn.btn-danger(@click="removeTrack(track._id)") REMOVE
    button#track-finder-close.btn-close.close.btn-close-white.position-absolute(
      type='button'
      aria-label='Close'
      @click='triggerTrackFinder'
    )
      span(aria-hidden="true") &times;
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  PropType,
  ref,
  toRefs,
  useContext,
} from '@nuxtjs/composition-api'

import {
  getVideoTracks as getVideoTracksRoute,
} from '@/routes/video'

import { SubTrack } from '@/util/subtitle'
import { Track } from '@api/track'

export default defineComponent({
  props: {
    videoId: { type: String, required: true },
    tracks: { type: Array as PropType<SubTrack[]>, required: true },
    triggerTrackFinder: { type: Function as PropType<() => void>, required: true },
    addTrack: { type: Function as PropType<(trackId: string) => void>, required: true },
    removeTrack: { type: Function as PropType<(trackId: string) => void>, required: true },
  },
  setup(props) {
    const { $api } = useContext()

    const { videoId } = toRefs(props)

    const trackList = ref<(Track & { _id: string })[]>([])
    const selectedTrackId = ref<string>('')

    onMounted(async() => {
      const tracks = await $api(getVideoTracksRoute(videoId.value))()
      trackList.value = tracks.map(t => ({ ...t, _id: t._id }))
    })

    return { trackList, selectedTrackId }
  },
})
</script>

<style lang="sass" scoped>
#track-finder
  left: 20%
  right: 20%
  top: 10%
  bottom: 10%
  background-color: #000000DD
  z-index: 20
  &>.wrap
    max-height: 100%
    overflow: auto
  #track-finder-close
    right: 1.5rem
    top: 1rem
</style>
