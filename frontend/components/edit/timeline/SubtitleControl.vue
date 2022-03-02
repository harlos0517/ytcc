<template lang="pug">
  g.timeline-sub-control
    rect.move-target(
      :x="isSelfTarget(sub, 'move') ? 0 : getDisplayPosition(sub.startTime)"
      :y="trackY"
      rx="4"
      :width="isSelfTarget(sub, 'move') ? '100%' : getSubWidth(sub)"
      :height="trackHeight"
      :class="{ 'd-none': !isMoveEnabled(sub) }"
      @mousedown="subDragPoint(sub, 'move')"
    )
    rect.drag.drag-start(
      :x="isSelfTarget(sub, 'start') ? 0 : getDisplayPosition(sub.startTime)"
      :y="trackY"
      rx="4"
      :width="isSelfTarget(sub, 'start') ? '100%' : 10"
      :height="trackHeight"
      :class="{ 'd-none': !isDragEnabled(sub) }"
      @mousedown="subDragPoint(sub, 'start')"
    )
    rect.drag.drag-end(
      :x="isSelfTarget(sub, 'end') ? 0 : (getDisplayPosition(sub.endTime) - 10)"
      :y="trackY"
      rx="4"
      :width="isSelfTarget(sub, 'end') ? '100%' : 10"
      :height="trackHeight"
      :class="{ 'd-none': !isDragEnabled(sub) }"
      @mousedown="subDragPoint(sub, 'end')"
    )
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  toRefs,
  useContext,
  PropType,
} from '@nuxtjs/composition-api'
// import { StoreState } from '@/store'

import { Sub } from '@/util/subtitle'
import { roundTime } from '@/util/time'

import { updateInfos } from '@/routes/info'

export default defineComponent({
  props: {
    sub: { type: Object as PropType<Sub>, required: true },
    videoLength: { type: Number, required: true },
    pointerTime: { type: Number, required: true },
    trackY: { type: Number, required: true },
    trackHeight: { type: Number, required: true },
    getSubWidth: {
      type: Function as PropType<(sub: Sub) => number>,
      required: true,
    },
    getDisplayPosition: {
      type: Function as PropType<(time: number) => number>,
      required: true,
    },
  },
  setup(props) {
    const { videoLength, pointerTime, getSubWidth } = toRefs(props)
    const { $api } = useContext()

    const isDragEnabled = (sub: Sub) => getSubWidth.value(sub) > 20

    const isMoveEnabled = (sub: Sub) => getSubWidth.value(sub) > 10

    // subtitle controls
    const draggingSub = ref<Sub | null>(null)
    const draggingType = ref('')
    const dragSubtitle = () => {
      const sub = draggingSub.value
      const pos = draggingType.value
      if (!sub || (pos !== 'start' && pos !== 'end')) return
      sub.dragPoint = sub.dragPoint || roundTime(pointerTime.value)
      const min = (pos === 'start')
        ? (sub.prev ? sub.prev.endTime : 0) - sub.startTime
        : (sub.startTime + 0.1 - sub.endTime)
      const max = (pos === 'start')
        ? (sub.endTime - 0.1 - sub.startTime)
        : (sub.next ? sub.next.startTime : videoLength.value) - sub.endTime
      let time = roundTime(pointerTime.value - sub.dragPoint)
      time = Math.max(min, time)
      time = Math.min(max, time)
      time = roundTime(time)
      sub.dragPoint = roundTime(sub.dragPoint + time)
      if (pos === 'start') sub.startTime += time
      if (pos === 'end') sub.endTime += time
    }
    const moveSubtitle = () => {
      const sub = draggingSub.value
      const pos = draggingType.value
      if (!sub || pos !== 'move') return
      sub.dragPoint = sub.dragPoint || roundTime(pointerTime.value)
      let dt = roundTime(pointerTime.value - sub.dragPoint)
      const min = (sub.prev ? sub.prev.endTime : 0) - sub.startTime
      const max = (sub.next ? sub.next.startTime : videoLength.value) - sub.endTime
      dt = Math.max(min, dt)
      dt = Math.min(max, dt)
      dt = roundTime(dt)
      sub.dragPoint = roundTime(sub.dragPoint + dt)
      sub.startTime = roundTime(sub.startTime + dt)
      sub.endTime = roundTime(sub.endTime + dt)
    }
    const subDragPoint = (sub: Sub, type: string) => {
      draggingSub.value = sub
      draggingType.value = type
      sub.dragPoint = roundTime(pointerTime.value)
    }
    const subDragEnd = () => {
      const sub = draggingSub.value
      draggingSub.value = null
      draggingType.value = ''
      if (!sub || !sub._id) return
      $api(updateInfos())([{
        _id: sub._id,
        startTime: sub.startTime,
        endTime: sub.endTime,
        text: sub.text,
      }])
    }
    const isSelfTarget = (sub: Sub, type: string) =>
      draggingSub.value === sub && draggingType.value === type


    onMounted(() => {
      window.addEventListener('mouseup', subDragEnd)
      window.addEventListener('mousemove', moveSubtitle)
      window.addEventListener('mousemove', dragSubtitle)
    })

    return {
      subDragPoint,
      isSelfTarget,
      isDragEnabled,
      isMoveEnabled,
    }
  },
})
</script>

<style lang="sass" scoped>
.move-target
  cursor: move
.drag
  cursor: ew-resize
</style>
