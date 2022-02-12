<template lang="pug">
  .p-2.d-flex.flex-row.align-items-center.rounded(
    :class="{'bg-secondary': true}"
  )
    .time.me-3.font-monospace(@click="seek(subtitle.start_time)")
      .start-time
        span {{ getTimeString(subtitle.start_time) }}:
      .end-time
        span {{ getTimeString(subtitle.end_time) }}:
    textarea.text.p-0.bg-dark.text-white.flex-fill.me-3(
      placeholder="Enter Subtitles Here"
      v-model="subtitle.text"
      @blur="saveSubtitles"
    )
    button.btn-close.close.btn-close-white(
      type='button'
      aria-label='Close'
      @click='deleteSubtitle(subtitle)'
    )
</template>

<script lang="ts">
import { defineComponent, toRefs, onMounted } from '@nuxtjs/composition-api'
// import { StoreState } from '@/store'

export default defineComponent({
  props: {
    videoLength: { type: Number, default: 60 },
    subtitle: { type: Object, required: true },
  },
  setup(props) {
    // const store = useStore() as StoreState
    const { videoLength, subtitle } = toRefs(props)

    const getTimeString = (time: number) => {
      const rounded = Math.round(time * 100) / 100
      const hour = Math.floor(rounded / 3600)
      const min = Math.floor(rounded % 3600 / 60)
      const sec = Math.floor(rounded % 60)
      const hourString = videoLength.value > 3600 ? hour.toString() + ':' : ''
      const minString = (videoLength.value > 3600
        ? min.toString().padStart(2, '0') : min.toString()) + ':'
      const secString = sec.toString().padStart(2, '0')
      return hourString + minString + secString
    }
    onMounted(() => {})

    return { getTimeString }
  },
})
</script>

<style lang="sass" scoped></style>
