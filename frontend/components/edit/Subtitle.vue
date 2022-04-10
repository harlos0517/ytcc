<template lang="pug">
  .btn.btn-dark.my-1.p-2.d-flex.flex-row.align-items-center.rounded(
    :class="{'bg-secondary': subtitle.active}"
  )
    .time.mr-2.text-monospace.small(@click="seek(subtitle.startTime)")
      .start-time
        span {{ timeDisplay(subtitle.startTime) }}
      .end-time
        span {{ timeDisplay(subtitle.endTime) }}
    textarea.text.p-0.bg-dark.text-white.flex-fill.me-3(
      ref="textareaRef"
      placeholder="Enter Subtitles Here"
      v-model="subtitle.text"
      :style="{ height: textareaHeight + 'px' }"
      @blur="saveSubtitle"
      @input="changeHeight"
      @change="changeHeight"
    )
    button.btn-close.close.btn-close-white(
      type='button'
      aria-label='Close'
      @click='deleteSubtitle(subtitle)'
    )
      span(aria-hidden="true") &times;
</template>

<script lang="ts">
import { defineComponent, toRefs, PropType, useContext, ref, onMounted } from '@nuxtjs/composition-api'
// import { StoreState } from '@/store

import {
  updateInfos as updateInfosRoute,
  deleteInfos as deleteInfosRoute,
} from '@/routes/info'
import { Sub } from '@/util/subtitle'
import { getTimeString } from '@/util/time'

export default defineComponent({
  props: {
    videoLength: { type: Number, default: 60 },
    subtitle: { type: Object as PropType<Sub>, required: true },
    seek: { type: Function, required: true },
    deleteInSub: { type: Function as PropType<(sub: Sub) => void>, required: true },
  },
  setup(props) {
    // const store = useStore() as StoreState
    const { $api } = useContext()
    const { videoLength, subtitle, deleteInSub } = toRefs(props)

    const textareaRef = ref<HTMLElement | null>(null)
    const textareaHeight = ref(50)

    const saveSubtitle = () => {
      if (!subtitle.value._id) return
      $api(updateInfosRoute())([{
        _id: subtitle.value._id,
        startTime: subtitle.value.startTime,
        endTime: subtitle.value.endTime,
        text: subtitle.value.text,
      }])
    }
    const deleteSubtitle = () => {
      deleteInSub.value(subtitle.value)
      if (!subtitle.value._id) return
      $api(deleteInfosRoute([subtitle.value._id]))()
    }

    const changeHeight = () => {
      const inputRef = textareaRef.value
      textareaHeight.value = inputRef ? inputRef.scrollHeight + 2 : 50
    }

    const timeDisplay = (time: number) =>
      getTimeString(time, videoLength.value > 3600)

    onMounted(() => {
      changeHeight()
    })

    return { textareaRef, textareaHeight, saveSubtitle, deleteSubtitle, changeHeight, timeDisplay }
  },
})
</script>

<style lang="sass" scoped>
.sub-item:hover
  background: #23272b
</style>
