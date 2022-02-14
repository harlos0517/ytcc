<template lang="pug">
  .my-1.p-2.d-flex.flex-row.align-items-center.rounded(
    :class="{'bg-secondary': true}"
  )
    .time.mr-2.text-monospace.small(@click="seek(subtitle.startTime)")
      .start-time
        span {{ getTimeString(subtitle.startTime) }}
      .end-time
        span {{ getTimeString(subtitle.endTime) }}
    textarea.text.p-0.bg-dark.text-white.flex-fill.me-3(
      placeholder="Enter Subtitles Here"
      v-model="subtitle.text"
      @blur="saveSubtitle"
    )
    button.btn-close.close.btn-close-white(
      type='button'
      aria-label='Close'
      @click='deleteSubtitle(subtitle)'
    )
      span(aria-hidden="true") &times;
</template>

<script lang="ts">
import { defineComponent, toRefs, onMounted, PropType } from '@nuxtjs/composition-api'
// import { StoreState } from '@/store

import {
  updateInfos as updateInfosRoute,
  deleteInfos as deleteInfosRoute,
} from '@/routes/info'
import { Sub } from '@/pages/edit.vue'

export default defineComponent({
  props: {
    videoLength: { type: Number, default: 60 },
    subtitle: { type: Object as PropType<Sub>, required: true },
    seek: { type: Function, required: true },
    deleteInSub: { type: Function as PropType<(sub: Sub) => void>, required: true },
  },
  setup(props) {
    // const store = useStore() as StoreState
    const { videoLength, subtitle, deleteInSub } = toRefs(props)

    const saveSubtitle = () => {
      const info = {
        _id: subtitle.value._id,
        start_time: subtitle.value.startTime,
        end_time: subtitle.value.endTime,
        text: subtitle.value.text,
      }
      updateInfosRoute()([info])
    }

    const deleteSubtitle = () => {
      deleteInSub.value(subtitle.value)
      deleteInfosRoute([subtitle.value._id])()
    }

    const getTimeString = (time: number) => {
      const rounded = Math.round(time * 100) / 100
      const hour = Math.floor(rounded / 3600)
      const min = Math.floor(rounded % 3600 / 60)
      const sec = rounded % 60
      const hourString = videoLength.value > 3600 ? hour.toString() + ':' : ''
      const minString = (videoLength.value > 3600
        ? min.toString().padStart(2, '0') : min.toString()) + ':'
      const secString = sec.toFixed(2).toString().padStart(5, '0')
      return hourString + minString + secString
    }
    onMounted(() => {})

    return { getTimeString, saveSubtitle, deleteSubtitle }
  },
})
</script>

<style lang="sass" scoped></style>
