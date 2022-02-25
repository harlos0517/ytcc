<template lang="pug">
  svg#timeline-map-svg(
    width="100%"
    :height="timelineHeight"
    ref="timelineSvg"
    @wheel="timelineWheel"
  )
    g#timeline-bg
      rect(
        x="0"
        :y="scrollbarHeight"
        width="100%"
        :height="timelineHeight - scrollbarHeight"
        fill="#000000"
      )
    g#timeline-map-timeline-scroll
      rect(
        :x="timelineStart / timelineLength / timelineScale * 100 + '%'"
        y="0"
        :width="(1 / timelineScale) * 100 + '%'"
        :height="scrollbarHeight"
        rx="4"
        fill="#FFFFFF88"
        @mousedown="timelineMapDragPoint"
      )
    g#ruler
      g.main-ruler
        template(v-for="x in getRulerNum()")
          line(
            :x1="getDisplayPosition(getRulerTime(x))"
            :y1="scrollbarHeight"
            :x2="getDisplayPosition(getRulerTime(x))"
            :y2="scrollbarHeight + getRulerLineHeight(x)"
            stroke="#0DCAF0"
          )
          text.text-monospace(
            v-if="getRulerType(x) === 'main'"
            :x="getDisplayPosition(getRulerTime(x)) + 5"
            :y="scrollbarHeight + rulerTextOffset"
            fill="#999999"
            font-size="10px"
          ) {{ getRulerText(x) }}
    g#timeline-subs
      g.timeline-track(
        v-for="(t, i) in tracks"
        :fill="t._id === curTrackId ? '#FFFFFF22' : '#00000000'"
        :style="{ opacity: t._id === curTrackId ? 1 : .5 }"
      )
        g.position-absolute.timeline-sub.rounded.h-100(
          v-for="sub in t.subs.data"
        )
          rect(
            :x="getDisplayPosition(sub.startTime)"
            :y="scrollbarHeight + rulerSpaceHeight + trackHeight * i"
            rx="4"
            :width="getSubWidth(sub)"
            :height="trackHeight"
            fill="#FFFFFF88"
            stroke="#FFFFFF"
            stroke-width="0.5px"
          )
    line#cursor(
      :x1="getDisplayPosition(cursor)"
      :y1="scrollbarHeight"
      :x2="getDisplayPosition(cursor)"
      :y2="timelineHeight"
      stroke="#FF0000"
    )
    g#timeline-box
      rect(
        x="0"
        :y="scrollbarHeight"
        width="100%"
        :height="timelineHeight"
        fill="#00000000"
        @click="timelineClick"
      )
    g#timeline-subs-control(
      fill="#00000000"
    )
      g.timeline-track(
        v-for="(t, i) in tracks"
        @click="changeTrack(t._id)"
      )
        g.position-absolute.timeline-sub.rounded.h-100(
          v-for="sub in t.subs.data"
        )
          rect.move-target(
            :x="getDisplayPosition(sub.startTime)"
            :y="scrollbarHeight + rulerSpaceHeight + trackHeight * i"
            rx="4"
            :width="getSubWidth(sub)"
            :height="trackHeight"
            :class="{ 'd-none': !isMoveEnabled(sub) }"
            @mousedown="subDragPoint(sub, 'move')"
          )
          rect.drag.drag-start(
            :x="getDisplayPosition(sub.startTime)"
            :y="scrollbarHeight + rulerSpaceHeight + trackHeight * i"
            rx="4"
            :width="10"
            :height="trackHeight"
            :class="{ 'd-none': !isDragEnabled(sub) }"
            @mousedown="subDragPoint(sub, 'start')"
          )
          rect.drag.drag-end(
            :x="getDisplayPosition(sub.endTime) - 10"
            :y="scrollbarHeight + rulerSpaceHeight + trackHeight * i"
            rx="4"
            :width="10"
            :height="trackHeight"
            :class="{ 'd-none': !isDragEnabled(sub) }"
            @mousedown="subDragPoint(sub, 'end')"
          )
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, toRefs, PropType } from '@nuxtjs/composition-api'
import { YouTubePlayer } from '@/plugins/vue-youtube'

import { Sub, SubTrack } from '@/util/subtitle'
import { getTimeString, roundTime } from '@/util/time'

export default defineComponent({
  props: {
    videoLength: { type: Number, default: 60 },
    // eslint-disable-next-line vue/require-prop-types
    player: { default: null as YouTubePlayer | null },
    tracks: {
      type: Array as PropType<SubTrack[]>,
      default: [] as SubTrack[],
    },
    curTrackId: { type: String, default: '' },
    changeTrack: {
      type: Function as PropType<(id: string) => void>,
      required: true,
    },
  },
  setup(props) {
    const { videoLength, player, tracks } = toRefs(props)

    const maxScale = computed(() =>
      videoLength.value / 2,
    )
    const trackNum = computed(() =>
      tracks.value.length,
    )

    // pointer
    const cursor = ref(0)
    const mousePosition = ref({ x: 0, y: 0 })
    const dragPoint = ref(0)
    const pointerTime = computed(() =>
      timelineStart.value + pointerRatio.value * timelineLength.value,
    )
    const isCursorInView = computed(() =>
      cursor.value > timelineStart.value && cursor.value < timelineEnd.value,
    )

    // timeline layout
    const trackHeight = 32
    const scrollbarHeight = 8
    const rulerSpaceHeight = 24
    const rulerTextOffset = 20
    const timelineHeight = computed(() =>
      scrollbarHeight + rulerSpaceHeight + trackHeight * trackNum.value,
    )

    // timeline
    const timelineSvg = ref<HTMLElement | null>(null)
    const timelineStart = ref(0)
    const timelineScale = ref(1)
    const isTimelineDragging = ref(false)
    const timelineWidth = ref(1440)
    const pointerRatio = computed(() =>
      mousePosition.value.x / timelineWidth.value,
    )
    const timelineLength = computed(() =>
      videoLength.value / timelineScale.value,
    )
    const timelineEnd = computed(() =>
      timelineStart.value + timelineLength.value,
    )
    const density = computed(() =>
      timelineLength.value / timelineWidth.value,
    )

    const timelineScrollFix = () => {
      timelineStart.value = Math.max(timelineStart.value, 0)
      timelineStart.value = Math.min(
        timelineStart.value,
        videoLength.value - timelineLength.value,
      )
    }
    const getSubWidth = (sub: Sub) => {
      const duration = sub.endTime - sub.startTime
      return timelineWidth.value * duration / timelineLength.value
    }
    const isDragEnabled = (sub: any) => getSubWidth(sub) > 20

    const isMoveEnabled = (sub: any) => getSubWidth(sub) > 10

    const getDisplayPosition = (time: number) =>
      (time - timelineStart.value) / timelineLength.value * timelineWidth.value

    // timeline events
    const timelineWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (e.ctrlKey)
        timelineZoom(e.deltaY)
      else
        timelineScroll(e.deltaY)
    }
    const timelineClick = () => {
      player.value?.seekTo(pointerTime.value, true)
    }
    const timelineMapDrag = () => {
      if (!isTimelineDragging.value) return
      dragPoint.value = dragPoint.value || pointerRatio.value
      let dr = (pointerRatio.value - dragPoint.value)
      const min = 0 - timelineStart.value / videoLength.value
      const max = 1 - (timelineStart.value + timelineLength.value) / videoLength.value
      dr = Math.max(min, dr)
      dr = Math.min(max, dr)
      dragPoint.value = dragPoint.value + dr
      timelineStart.value = timelineStart.value + dr * videoLength.value
    }
    const timelineMapDragPoint = () => {
      dragPoint.value = pointerRatio.value
      isTimelineDragging.value = true
    }
    const timelineMapDragEnd = () => {
      isTimelineDragging.value = false
    }
    const timelineZoom = (delta: number) => {
      const fixedTime = pointerTime.value

      timelineScale.value *= Math.pow(1.2, -delta / 100)
      timelineScale.value = Math.max(1, timelineScale.value)
      timelineScale.value = Math.min(maxScale.value, timelineScale.value)

      timelineStart.value = fixedTime - timelineLength.value * pointerRatio.value
      timelineScrollFix()
    }
    const timelineScroll = (delta: number) => {
      timelineStart.value += delta * timelineLength.value / 1000
      timelineScrollFix()
    }

    // rulers
    const rulers = [1, 10, 60, 600, 3600]
    const rulerThreshold = 0.02
    const rulerLineHeight = [16, 10, 6]
    const getRuler = () => {
      let lastRulerIndex = rulers.length - 1
      for (let i = 0; i < rulers.length; i++) {
        const thisRuler = rulers[i]
        if (!thisRuler) throw new Error('Out of range')
        if (density.value <= thisRuler * rulerThreshold) {
          lastRulerIndex = i
          break
        }
      }
      const lastRuler = rulers[lastRulerIndex]
      if (!lastRuler) throw new Error('Out of range')
      return {
        main: lastRuler,
        half: lastRuler / 2,
        sub: rulers[lastRulerIndex - 1] || 0.1,
      }
    }

    const getRulerNum = () =>
      Math.ceil(timelineLength.value / getRuler().sub) + 1

    const getRulerTime = (x: number) => {
      const { sub } = getRuler()
      return (Math.floor(timelineStart.value / sub) + x - 1) * sub
    }
    const getRulerType = (x: number) => {
      const time = getRulerTime(x)
      const { main, half } = getRuler()
      if (time % main === 0) return 'main'
      if (time % half === 0) return 'half'
      return 'sub'
    }
    const getRulerLineHeight = (x: number) => {
      const type = getRulerType(x)
      if (type === 'main') return rulerLineHeight[0]
      if (type === 'half') return rulerLineHeight[1]
      return rulerLineHeight[2]
    }
    const getRulerText = (x: number) =>
      getTimeString(getRulerTime(x), videoLength.value > 3600, false)

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
    const subDragPoint = (sub: any, type: string) => {
      draggingSub.value = sub
      draggingType.value = type
      sub.dragPoint = roundTime(pointerTime.value)
    }
    const subDragEnd = () => {
      draggingSub.value = null
      draggingType.value = ''
    }

    // update routine
    const update = () => {
      updateCursor()
      setSubActive()
      autoScroll()
      window.requestAnimationFrame(update)
    }
    const updateCursor = async() => {
      cursor.value = await player.value?.getCurrentTime() || 0
    }
    const setSubActive = () => {
      // TODO : OPT ALGO
      tracks.value.forEach(t => t.subs.setActive(cursor.value))
      // Yeah fuck the algo, brutal works la
    }
    const autoScroll = async() => {
      if (player.value && await player.value.getPlayerState() === 1) {
        const ratio = 0.9
        if (!isCursorInView.value)
          timelineStart.value = cursor.value - timelineLength.value * (1 - ratio)
        else if (cursor.value > timelineStart.value + timelineLength.value * ratio) {
          const newTimelineStart = cursor.value - timelineLength.value * ratio
          if (newTimelineStart + timelineLength.value < videoLength.value)
            timelineStart.value = newTimelineStart
        }
        timelineScrollFix()
      }
    }

    // on mounted
    const listenPointer = () => {
      window.addEventListener('mousemove', e => {
        mousePosition.value.x = e.x
        mousePosition.value.y = e.y
      }, true)
      window.addEventListener('drag', e => {
        if (!e.x && !e.y) return
        mousePosition.value.x = e.x
        mousePosition.value.y = e.y
      }, true)
      window.addEventListener('mouseup', timelineMapDragEnd)
      window.addEventListener('mouseup', subDragEnd)
      window.addEventListener('mousemove', timelineMapDrag)
      window.addEventListener('mousemove', moveSubtitle)
      window.addEventListener('mousemove', dragSubtitle)
    }
    const onResize = () => {
      timelineWidth.value = timelineSvg.value?.getBoundingClientRect().width || 1440
    }

    onMounted(() => {
      listenPointer()
      window.addEventListener('resize', onResize)
      onResize()
      update()
    })

    return {
      trackNum,

      cursor,

      trackHeight,
      scrollbarHeight,
      rulerSpaceHeight,
      rulerTextOffset,
      timelineHeight,

      timelineSvg,
      timelineStart,
      timelineLength,
      timelineScale,

      timelineWheel,
      timelineClick,
      timelineMapDragPoint,

      getRulerNum,
      getRulerTime,
      getRulerType,
      getRulerLineHeight,
      getRulerText,

      getSubWidth,
      isDragEnabled,
      isMoveEnabled,
      getDisplayPosition,

      subDragPoint,
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
