<template lang="pug">
  div.my-1
    b-input-group(size="md" prepend="Name")
      b-form-input(v-model="trackName" @blur="updateTrack(track._id, { name: trackName })")
    b-form-checkbox(v-model="trackPublic" @change="updateTrack(track._id, { public: trackPublic })") Public
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  ref,
  toRefs,
  useContext,
  watch,
} from '@nuxtjs/composition-api'

import { SubTrack } from '@/util/subtitle'
import { Track } from '@api/track'

import {
  updateTrack as updateTrackRoute,
} from '@/routes/track'

export default defineComponent({
  props: {
    track: { type: Object as PropType<SubTrack>, required: true },
  },
  setup(props) {
    const { track } = toRefs(props)
    const { $api } = useContext()

    const trackName = ref(track.value.name)
    const trackPublic = ref(track.value.public)

    const updateTrack = async(id: string, trackData: Partial<Track>) => {
      await $api(updateTrackRoute())({ ...trackData, _id: id })
      track.value.name = trackName.value
    }

    watch(track, newTrack => {
      trackName.value = newTrack.name
      trackPublic.value = newTrack.public
    })

    return {
      trackName,
      trackPublic,
      updateTrack,
    }
  },
})
</script>

<style lang="sass" scoped></style>
