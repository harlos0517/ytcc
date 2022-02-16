<template lang="pug">
  svg#timeline-map-svg(
    width="100%"
    :height="40 + trackHeight * trackNum"
    ref="timelineSvg"
  )
    g#timeline-bg
      rect(
        x="0"
        y="8"
        width="100%"
        :height="32 + trackHeight * trackNum"
        fill="#000000"
      )
    g#timeline-map-timeline-scroll
      rect(
        :x="timelineStart / timelineLength / timelineScale * 100 + '%'"
        y="0"
        :width="(1 / timelineScale) * 100 + '%'"
        height="8"
        rx="4"
        fill="#FFFFFF88"
        @mousedown="timelineMapDragPoint"
      )
    g#ruler
      g.main-ruler
        g(v-for="x in getRulerNum('main')")
          line(
            :x1="getDisplayPositionRatio(getRulerTime('main', x)) + '%'"
            y1="8"
            :x2="getDisplayPositionRatio(getRulerTime('main', x)) + '%'"
            y2="24"
            stroke="#0DCAF0"
          )
          text.text-monospace(
            :x="`${getDisplayPositionRatio(getRulerTime('main', x)) + 0.5}%`"
            y="32"
            fill="#999999"
            font-size="10px"
          ) {{ getTimeString(getRulerTime('main', x)) }}
      g.sub-ruler()
        line(
          v-for="x in getRulerNum('sub')"
          :x1="getDisplayPositionRatio(getRulerTime('sub', x)) + '%'"
          y1="8"
          :x2="getDisplayPositionRatio(getRulerTime('sub', x)) + '%'"
          y2="14"
          stroke="#0DCAF0"
        )
      g.sub2-ruler()
        line(
          v-for="x in getRulerNum('sub2')"
          :x1="getDisplayPositionRatio(getRulerTime('sub2', x)) + '%'"
          y1="8"
          :x2="getDisplayPositionRatio(getRulerTime('sub2', x)) + '%'"
          y2="18"
          stroke="#0DCAF0"
        )
    g#timeline-subs
      g.timeline-track(
        v-for="(t, i) in tracks"
        :fill="t._id === curTrackId ? '#FFFFFF22' : '#00000000'"
        :style="{ opacity: t._id === curTrackId ? 1 : .5 }"
        @click="curTrackId = t._id"
      )
        g.position-absolute.timeline-sub.rounded.h-100(
          v-for="sub in t.subs.data"
        )
          rect(
            :x="getDisplayPositionRatio(sub.startTime) + '%'"
            :y="40 + trackHeight * i"
            rx="4"
            :width="getSubWidth(sub)"
            height="40"
            fill="#FFFFFF88"
            stroke="#FFFFFF"
            stroke-width="0.5px"
          )
          //- rect.position-absolute.move-target(
          //-   draggable="true"
          //-   @drag="moveSubtitle($event, sub)"
          //-   @dragstart="setDragPoint(sub)"
          //-   @dragend="saveSubtitles"
          //- )
          //- rect.drag.drag-start.position-absolute(
          //-   draggable="true"
          //-   :class="{ 'd-none': !isDragEnabled(sub) }"
          //-   @drag="dragSubtitle(sub, 'start')"
          //-   @dragend="saveSubtitles"
          //- )
          //- rect.drag.drag-end.position-absolute(
          //-   draggable="true"
          //-   :class="{ 'd-none': !isDragEnabled(sub) }"
          //-   @drag="dragSubtitle(sub, 'end')"
          //-   @dragend="saveSubtitles"
          //- )
    line#cursor(
      :x1="getDisplayPositionRatio(cursor) + '%'"
      y1="8"
      :x2="getDisplayPositionRatio(cursor) + '%'"
      :y2="40 + trackHeight * trackNum"
      stroke="#FF0000"
    )
    g#timeline-box
      rect(
        x="0"
        y="8"
        width="100%"
        :height="32 + 40 * trackNum"
        fill="#00000000"
        @click="timelineClick"
        @wheel="timelineWheel"
      )
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, toRefs, PropType } from '@nuxtjs/composition-api'
import { YouTubePlayer } from '@/plugins/vue-youtube'
import { Sub, SubTrack } from '@/pages/edit.vue'

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
  },
  setup(props) {
    const { videoLength, player, tracks } = toRefs(props)

    const timelineSvg = ref<HTMLElement | null>(null)

    const cursor = ref(0)
    const timelineStart = ref(0)
    const timelineScale = ref(1)
    const isTimelineDragging = ref(false)
    const mousePosition = ref({ x: 0, y: 0 })
    const dragPoint = ref(0)

    const rulers = [1, 10, 60, 600, 3600]
    const rulerThreshold = 0.025

    const timelineWidth = computed(() =>
      timelineSvg.value?.getBoundingClientRect().width || 1440,
    )
    const pointerRatio = computed(() =>
      mousePosition.value.x / timelineWidth.value,
    )
    const timelineLength = computed(() =>
      videoLength.value / timelineScale.value,
    )
    const timelineEnd = computed(() =>
      timelineStart.value + timelineLength.value,
    )
    const pointerTime = computed(() =>
      timelineStart.value + pointerRatio.value * timelineLength.value,
    )
    const timelineLeft = computed(() =>
      0 - timelineStart.value / timelineLength.value,
    )
    const maxScale = computed(() =>
      videoLength.value / 2,
    )
    const isCursorInView = computed(() =>
      cursor.value > timelineStart.value && cursor.value < timelineEnd.value,
    )
    const density = computed(() =>
      timelineLength.value / timelineWidth.value,
    )
    const trackNum = computed(() =>
      tracks.value.length,
    )

    const trackHeight = 40

    onMounted(() => {
      listenPointer()
      update()
    })

    // events
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
      window.addEventListener('mousemove', timelineMapDrag)
    }

    // update routine
    const update = () => {
      window.requestAnimationFrame(update)
      updateCursor()
      setSubActive()
      autoScroll()
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

    // time display utilities
    const roundTime = (time: number) =>
      Math.round(time * 100) / 100

    const getTimeString = (time: number) => {
      const rounded = roundTime(time)
      const hour = Math.floor(rounded / 3600)
      const min = Math.floor(rounded % 3600 / 60)
      const sec = Math.floor(rounded % 60)
      const hourString = videoLength.value > 3600 ? hour.toString() + ':' : ''
      const minString = (videoLength.value > 3600
        ? min.toString().padStart(2, '0') : min.toString()) + ':'
      const secString = sec.toString().padStart(2, '0')
      return hourString + minString + secString
    }

    // timeline utilities
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
    const isDragEnabled = (sub: any) => getSubWidth(sub) > 10

    const getDisplayPositionRatio = (time: number) =>
      (time - timelineStart.value) / timelineLength.value * 100

    const getDisplayWidthRatio = (time: number) =>
      time / timelineLength.value * 100

    // timeline ruler
    const getRuler = (type: string) => {
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
      return (type === 'main') ? lastRuler
           : (type === 'sub') ? (rulers[lastRulerIndex - 1] || 0.1)
           : (lastRuler / 2)
    }
    const getRulerNum = (type: string) =>
      Math.ceil(timelineLength.value / getRuler(type)) + 1

    const getRulerTime = (type: string, x: number) =>
      (Math.floor(timelineStart.value / getRuler(type)) + x - 1) * getRuler(type)

    // timeline controls
    const timelineWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (e.ctrlKey) {
        timelineZoom(e.deltaY)
      } else {
        timelineScroll(e.deltaY)
      }
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


    // subtitle controls
    const moveSubtitle = (_e: Event, sub: any) => {
      sub.dragPoint = sub.dragPoint || roundTime(pointerTime.value)
      let dt = roundTime(pointerTime.value - sub.dragPoint)
      const min = (sub.prev ? sub.prev.end : 0) - sub.start
      const max = (sub.next ? sub.next.start : videoLength.value) - sub.end
      dt = Math.max(min, dt)
      dt = Math.min(max, dt)
      dt = roundTime(dt)
      sub.dragPoint = roundTime(sub.dragPoint + dt)
      sub.start = roundTime(sub.start + dt)
      sub.end = roundTime(sub.end + dt)
    }
    const setDragPoint = (sub: any) => {
      sub.dragPoint = roundTime(pointerTime.value)
    }

    return {
      timelineSvg,
      cursor,
      timelineStart,
      timelineLength,
      timelineScale,
      timelineLeft,
      isTimelineDragging,
      trackNum,
      trackHeight,
      getRulerNum,
      getRulerTime,
      getTimeString,
      timelineMapDrag,
      timelineMapDragPoint,
      timelineMapDragEnd,
      timelineWheel,
      timelineClick,
      setDragPoint,
      moveSubtitle,
      getSubWidth,
      isDragEnabled,
      getDisplayPositionRatio,
      getDisplayWidthRatio,
    }
  },
})
</script>

<style lang="sass" scoped></style>
