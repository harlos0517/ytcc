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
    g#timeline-scroll-bar
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
      EditTimelineRuler(
        :videoLength="videoLength"
        :getDisplayPosition="getDisplayPosition"
        :density="density"
        :timelineLength="timelineLength"
        :timelineStart="timelineStart"
        :scrollbarHeight="scrollbarHeight"
        :rulerTextOffset="rulerTextOffset"
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
    g#timeline-subs
      g.timeline-track(
        v-for="(t, i) in tracks"
        @click="changeTrackAndSeek(t._id)"
      )
        rect.track-control(
          :x="0"
          :y="scrollbarHeight + rulerSpaceHeight + trackHeight * i"
          :width="'100%'"
          :height="trackHeight"
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
    g#timeline-sub-controls(
      fill="#00000000"
    )
      g.timeline-sub-controls-track(
        v-for="(t, i) in tracks"
        @click="changeTrack(t._id)"
      )
        EditTimelineSubtitleControl.timeline-sub(
          v-for="(sub, si) in t.subs.data"
          :key="si"
          :sub="sub"
          :videoLength="videoLength"
          :pointerTime="pointerTime"
          :trackY="getTrackYPos(i)"
          :trackHeight="trackHeight"
          :getSubWidth="getSubWidth"
          :getDisplayPosition="getDisplayPosition"
        )
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  onMounted,
  toRefs,
  PropType,
} from '@nuxtjs/composition-api'
import { YouTubePlayer } from '@/plugins/vue-youtube'

import { Sub, SubTrack } from '@/util/subtitle'

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
    const { videoLength, player, tracks, changeTrack } = toRefs(props)

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
    const getDisplayPosition = (time: number) =>
      (time - timelineStart.value) / timelineLength.value * timelineWidth.value

    const getTrackYPos = (i: number) =>
      scrollbarHeight + rulerSpaceHeight + trackHeight * i

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
    const changeTrackAndSeek = (id: string) => {
      changeTrack.value(id)
      timelineClick()
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
      window.addEventListener('mousemove', timelineMapDrag)
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
      pointerTime,

      trackHeight,
      scrollbarHeight,
      rulerSpaceHeight,
      rulerTextOffset,
      timelineHeight,

      timelineSvg,
      timelineStart,
      timelineLength,
      timelineScale,
      density,

      timelineWheel,
      timelineClick,
      timelineMapDragPoint,
      changeTrackAndSeek,

      getSubWidth,
      getDisplayPosition,
      getTrackYPos,
    }
  },
})
</script>

<style lang="sass" scoped></style>
