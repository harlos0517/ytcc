<template lang="pug">
  div.my-1
    b-input-group(size="md" prepend="Name")
      b-form-input(v-model="trackName" @blur="updateTrackName(track._id)")
    b-form-checkbox(v-model="trackPublic" @change="updateTrackPublic(track._id)") Public
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

    const updateTrackName = async(id: string) => {
      await $api(updateTrackRoute())({ name: trackName.value, _id: id })
      track.value.name = trackName.value
    }

    const updateTrackPublic = async(id: string) => {
      await $api(updateTrackRoute())({ public: trackPublic.value, _id: id })
      track.value.public = trackPublic.value
    }

    watch(track, newTrack => {
      trackName.value = newTrack.name
      trackPublic.value = newTrack.public
    })

    return {
      trackName,
      trackPublic,
      updateTrackName,
      updateTrackPublic,
    }
  },
})
</script>

<style lang="sass" scoped></style>
