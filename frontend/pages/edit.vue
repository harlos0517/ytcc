<template lang="pug">
  .fill-screen.flex-column.bg-dark.text-white

    #top: EditHeader

    #mid.flex-fill.flex-row.position-relative
      #video.flex-column
        #player.position-relative.flex-fill
          youtube(
            ref="youtube"
            :video-id="video ? video.handle : ''"
            resize
            width="100%"
            height="100%"
            :resizeDelay="1"
            fitParent
            @playing="onPlaying"
            @ready="onReady"
            @paused="onPaused"
            @ended="onEnded"
            @buffering="onBuffering"
            @cued="onCued"
          )
          #video-subs.w-100.position-absolute.text-center.h3
        EditTimeline(
          :videoLength="videoLength"
          :player="player"
          :tracks="tracks"
          :curTrackId="curTrackId"
        )
      #subtitle.flex-column.px-2
        #tracks
          ul.nav.nav-tabs
            li.nav-item(v-for="(t, i) in tracks")
              a.nav-link.btn(:class="{ active: t._id === curTrackId}")
                span(@click="curTrackId = t._id") {{ i }}
                button.btn-close.close.btn-close-white(
                  type="button"
                  aria-label="Close"
                  @click="deleteTrack(i)"
                )
            li.nav-item
              a.nav-link(@click="newTrack") +
        #subs.flex-fill.position-relative
          .wrap.position-absolute.w-100
            EditSubtitle(
              v-for="(sub, i) in curSubs"
              :key="i"
              :subtitle="sub"
              :seek="seek"
              :videoLength="videoLength"
              :deleteInSub="deleteInSub(sub)"
            )
            button.btn.btn-dark.w-100.text-center.p-3(
              type="button"
              @click="addSubtitle()"
            ) +
        #toolbar.flex-row.middle-center
          span.m-0.h2.text-monospace {{ getTimeString(cursor) }}
    #bot.d-flex.flex-row
      span {{ infoText }}
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  defineComponent,
  ref,
  computed,
  onMounted,
  useRoute,
} from '@nuxtjs/composition-api'

import { Video } from '@api/video'
import { Track } from '@api/track'

import {
  getVideoById as getVideoByIdRoute,
  getVideoTracks as getVideoTracksRoute,
} from '@/routes/video'
import { newInfos as newInfosRoute } from '@/routes/info'
import {
  getTrackInfos as getTrackInfosRoute,
  newTrack as newTrackRoute,
} from '@/routes/track'

import {
  mapStateString,
  PlayerStates,
  YouTubePlayer,
} from '@/plugins/vue-youtube'

export type Sub = {
  _id?: string,
  startTime: number,
  endTime: number,
  text: string,
  next?: Sub | null,
  prev?: Sub | null,
}

class Subtitles {
  data: Array<Sub>

  constructor(data?: Array<Sub>) {
    this.data = []
    if (data) this.insertMany(data)
  }

  insertMany(subs: Sub[]) {
    return subs.map(this.insert.bind(this))
  }

  insert(sub: Sub) {
    const { _id, startTime, endTime, text } = sub
    if (endTime === undefined) throw new TypeError('Invalid end time.')
    const newSub: Sub = { _id, startTime, endTime, text, next: null, prev: null }

    let prevSub: Sub | null = null
    let thisSub: Sub | null = this.data[0] || null
    let i = 0
    while (thisSub && thisSub.endTime <= newSub.endTime) {
      prevSub = thisSub
      thisSub = thisSub.next || null
      i++
    }

    if (thisSub) newSub.endTime = Math.min(newSub.endTime, thisSub.startTime)
    const start = prevSub ? prevSub.endTime : 0
    newSub.startTime = Math.max(start, newSub.startTime)
    if (newSub.endTime - newSub.startTime < 0.1) {
      // eslint-disable-next-line no-console
      console.error('Time segment too small.')
      return null
    }
    newSub.next = thisSub
    newSub.prev = prevSub
    if (prevSub) prevSub.next = newSub
    if (thisSub) thisSub.prev = newSub
    this.data.splice(i, 0, newSub)
    return newSub
  }

  delete(sub: Sub) {
    const i = this.data.findIndex(s => s._id === sub._id)
    if (i < 0) throw new Error('This sub does not exist on this Subtitles.')
    if (sub.next) sub.next.prev = sub.prev
    if (sub.prev) sub.prev.next = sub.next
    this.data.splice(i, 1)
  }

  setActive(time: number) {
    this.data.forEach((sub: any) => {
      sub.active = (time >= sub.start && time < sub.end)
    })
  }
}

export type SubTrack = Track & { _id: string, subs: Subtitles }

export default defineComponent({
  setup() {
    // const store = useStore() as StoreState
    const route = useRoute()
    const videoId = route.value.query.videoId as string
    const video = ref<Video | null>(null)

    const youtube = ref<HTMLElement & { player: YouTubePlayer } | null>(null)
    const player = computed(() => youtube.value?.player)
    const state = ref(undefined as PlayerStates | undefined)
    // const curSub = ref(0)
    // const mousePosition = ref({ x: 0, y: 0 })
    // const showHelp = ref(false)
    // const curVersion = ref('1.0.0')
    const infoText = ref('')
    const videoLength = ref(60)
    const cursor = ref(0)

    const tracks = ref<SubTrack[]>([])
    const curTrackId = ref('')
    const curTrack = computed(() =>
      tracks.value.find(t => t._id === curTrackId.value),
    )
    const curSubs = computed(() => curTrack.value?.subs.data || [])

    const onReady = async(e: CustomEvent | any) => {
      state.value = await player.value?.getPlayerState()
      videoLength.value = await player.value?.getDuration() || 60
      infoText.value = mapStateString(state.value)
    }
    const onPlaying = (e: CustomEvent | any) => {
      state.value = PlayerStates.PLAYING
      infoText.value = mapStateString(state.value)
    }
    const onPaused = (e: CustomEvent | any) => {
      state.value = PlayerStates.PAUSED
      infoText.value = mapStateString(state.value)
    }
    const onEnded = (e: CustomEvent | any) => {
      state.value = PlayerStates.ENDED
      infoText.value = mapStateString(state.value)
    }
    const onBuffering = (e: CustomEvent | any) => {
      state.value = PlayerStates.BUFFERING
      infoText.value = mapStateString(state.value)
    }
    const onCued = async(e: CustomEvent | any) => {
      videoLength.value = await player.value?.getDuration() || 60
      state.value = PlayerStates.VIDEO_CUED
      infoText.value = mapStateString(state.value)
    }

    const getTimeString = (time: number) => {
      const rounded = Math.round(time * 100) / 100
      const hour = Math.floor(rounded / 3600)
      const min = Math.floor(rounded % 3600 / 60)
      const sec = Math.floor(time % 60 * 100) / 100
      const hourString = videoLength.value > 3600 ? hour.toString() + ':' : ''
      const minString = (videoLength.value > 3600
        ? min.toString().padStart(2, '0') : min.toString()) + ':'
      const secString = sec.toFixed(2).toString().padStart(5, '0')
      return hourString + minString + secString
    }

    const deleteTrack = () => {
    }
    const newTrack = async() => {
      const track = await newTrackRoute()({ videoId })
      tracks.value.push({ ...track, subs: new Subtitles() })
    }
    const addSubtitle = async() => {
      if (!curTrack.value) return
      const infos = [{
        text: '',
        startTime: Math.max(0, cursor.value - 1),
        endTime: cursor.value,
      }]
      if (curTrack.value.subs) {
        const ret = curTrack.value.subs.insertMany(infos)
        const subs = ret.filter(s => s) as Sub[]
        await newInfosRoute()(
          subs.map(sub => ({
            videoId,
            trackId: curTrackId.value,
            startTime: sub.startTime,
            endTime: sub.endTime,
            text: sub.text,
          })),
        )
      } else {
        curTrack.value.subs = new Subtitles(infos)
      }
    }
    const deleteInSub = (sub: Sub) => () => {
      curTrack.value?.subs.delete(sub)
    }

    const seek = (time: number) => {
      player.value?.seekTo(time, true)
    }

    // update routine
    const update = () => {
      window.requestAnimationFrame(update)
      updateCursor()
    }

    const updateCursor = async() => {
      cursor.value = await player.value?.getCurrentTime() || 0
    }

    onMounted(async() => {
      video.value = await getVideoByIdRoute(videoId)()
      const newTracks = await getVideoTracksRoute(videoId)()
      tracks.value = newTracks.map(t => ({ ...t, subs: new Subtitles() }))
      curTrackId.value = tracks.value[0]?._id || ''
      tracks.value.forEach(async t => {
        const subs = await getTrackInfosRoute(t._id)()
        t.subs.insertMany(subs.map(sub => ({
          startTime: sub.startTime,
          endTime: sub.endTime || 0,
          text: sub.text,
        })))
      })
      update()
    })

    return {
      youtube,
      video,
      tracks,
      curTrackId,
      curTrack,
      curSubs,
      state,
      infoText,
      videoLength,
      player,
      cursor,
      onReady,
      onPlaying,
      onPaused,
      onEnded,
      onBuffering,
      onCued,
      getTimeString,
      deleteTrack,
      newTrack,
      addSubtitle,
      deleteInSub,
      seek,
    }
  },
})
</script>

<style lang="sass" scoped>
#video
  flex: 3 0 0
#subtitle
  flex: 1 0 0

#subs
  overflow-y: auto
</style>
