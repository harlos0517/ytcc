<template lang="pug">
  g
    g(v-for="x in getRulerNum()")
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
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  toRefs,
} from '@nuxtjs/composition-api'

import { getTimeString } from '@/util/time'

export default defineComponent({
  props: {
    videoLength: { type: Number, required: true },
    getDisplayPosition: {
      type: Function as PropType<(time: number) => number>,
      required: true,
    },
    density: { type: Number, required: true },
    timelineLength: { type: Number, required: true },
    timelineStart: { type: Number, required: true },
    scrollbarHeight: { type: Number, required: true },
    rulerTextOffset: { type: Number, required: true },
  },
  setup(props) {
    const {
      videoLength,
      density,
      timelineLength,
      timelineStart,
    } = toRefs(props)

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


    return {
      getRulerNum,
      getRulerTime,
      getRulerType,
      getRulerLineHeight,
      getRulerText,
    }
  },
})
</script>

<style lang="sass" scoped></style>
