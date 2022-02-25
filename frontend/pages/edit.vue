<template lang="pug">
  .fill-screen.flex-column.bg-dark.text-white

    #top: EditHeader(
      :triggerHelp="triggerHelp"
      :downloadSRT="downloadSRT"
      :uploadSRT="uploadSRT"
      :importSRT="importSRT"
    )

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
            div(v-for="t in tracks")
              div(v-for="sub in t.subs.data.filter(x=>x.active).reverse()")
                | {{ sub.text }}
        EditTimeline(
          :videoLength="videoLength"
          :player="player"
          :tracks="tracks"
          :curTrackId="curTrackId"
          :changeTrack="changeTrack"
        )
      #subtitle.flex-column.px-2
        #tracks
          ul.nav.nav-tabs
            li.nav-item(v-for="(t, i) in tracks")
              a.nav-link.btn(
                :class="{ active: t._id === curTrackId}"
                @click="curTrackId = t._id"
              )
                span {{ i }}
                button.btn-close.close.btn-close-white(
                  type="button"
                  aria-label="Close"
                  @click="deleteTrack(t._id, i)"
                )
                  span(aria-hidden="true") &times;
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
          span.m-0.h2.text-monospace {{ getTimeText(cursor) }}
    #bot.d-flex.flex-row
      span {{ infoText }}
    EditHelp(v-if='showHelp' :triggerHelp="triggerHelp")
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-unused-vars */

import {
  defineComponent,
  ref,
  computed,
  onMounted,
  useRoute,
  useContext,
} from '@nuxtjs/composition-api'

import { Video } from '@api/video'

import {
  getVideoById as getVideoByIdRoute,
  getVideoTracks as getVideoTracksRoute,
} from '@/routes/video'
import { newInfos as newInfosRoute } from '@/routes/info'
import {
  getTrackInfos as getTrackInfosRoute,
  newTrack as newTrackRoute,
  deleteTrack as deleteTrackRoute,
} from '@/routes/track'

import {
  mapStateString,
  PlayerStates,
  PlayerStateString,
  YouTubePlayer,
} from '@/plugins/vue-youtube'

import { Sub, Subtitles, SubTrack } from '@/util/subtitle'
import { getTimeString } from '@/util/time'
import { exportSRT, parseSRT } from '@/util/srt'

export default defineComponent({
  setup() {
    // const store = useStore() as StoreState
    const route = useRoute()
    const videoId = route.value.query.videoId as string
    const video = ref<Video | null>(null)
    const { $api } = useContext()

    const youtube = ref<HTMLElement & { player: YouTubePlayer } | null>(null)
    const player = computed(() => youtube.value?.player)
    const state = ref(undefined as PlayerStates | undefined)
    // const curSub = ref(0)
    // const mousePosition = ref({ x: 0, y: 0 })
    const showHelp = ref(false)
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

    const changeTrack = (id: string) => {
      curTrackId.value = id
    }

    // player events
    const onReady = async(e: CustomEvent | any) => {
      state.value = await player.value?.getPlayerState()
      videoLength.value = await player.value?.getDuration() || 60
      infoText.value = mapStateString(state.value)
    }
    const onPlaying = (e: CustomEvent | any) => {
      state.value = PlayerStates.PLAYING
      infoText.value = PlayerStateString.PLAYING
    }
    const onPaused = (e: CustomEvent | any) => {
      state.value = PlayerStates.PAUSED
      infoText.value = PlayerStateString.PAUSED
    }
    const onEnded = (e: CustomEvent | any) => {
      state.value = PlayerStates.ENDED
      infoText.value = PlayerStateString.ENDED
    }
    const onBuffering = (e: CustomEvent | any) => {
      state.value = PlayerStates.BUFFERING
      infoText.value = PlayerStateString.BUFFERING
    }
    const onCued = async(e: CustomEvent | any) => {
      videoLength.value = await player.value?.getDuration() || 60
      state.value = PlayerStates.VIDEO_CUED
      infoText.value = PlayerStateString.VIDEO_CUED
    }

    // display function
    const getTimeText = (time: number) =>
      getTimeString(time, videoLength.value > 3600)

    // track operation
    const newTrack = async() => {
      const track = await $api(newTrackRoute())({ videoId })
      tracks.value.push({ ...track, subs: new Subtitles() })
      if (!curTrackId.value) curTrackId.value = tracks.value[0]?._id || ''
    }
    const deleteTrack = async(id: string, i: number) => {
      if (confirm('Are you sure to delete this track?')) {
        await $api(deleteTrackRoute(id))()
        tracks.value.splice(i, 1)
      }
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
        await $api(newInfosRoute())(
          subs.map(sub => ({
            videoId,
            trackId: curTrackId.value,
            startTime: sub.startTime,
            endTime: sub.endTime,
            text: sub.text,
          })),
        )
      } else
        curTrack.value.subs = new Subtitles(infos)
    }

    // passing function to children
    const deleteInSub = (sub: Sub) => () => {
      curTrack.value?.subs.delete(sub)
    }
    const seek = (time: number) => {
      player.value?.seekTo(time, true)
    }

    // update routine
    const updateCursor = async() => {
      cursor.value = await player.value?.getCurrentTime() || 0
    }
    const update = () => {
      window.requestAnimationFrame(update)
      updateCursor()
    }

    // on mounted
    const listenKey = (key: string, ctrl: Boolean, f: Function) => {
      window.addEventListener('keydown', e => {
        if (e.key !== key) return
        if (ctrl !== e.ctrlKey) return
        e.preventDefault()
        f()
      })
    }
    const triggerPlay = () => {
      if (state.value !== 1) player.value?.playVideo()
      else player.value?.pauseVideo()
    }
    const triggerHelp = () => {
      showHelp.value = !showHelp.value
    }
    const addKeyControl = () => {
      listenKey('Enter', true, addSubtitle)
      listenKey(' ', true, triggerPlay)
      listenKey('e', true, downloadSRT)
      listenKey('i', true, uploadSRT)
      listenKey('h', true, triggerHelp)
    }
    const tracksInit = async() => {
      video.value = await $api(getVideoByIdRoute(videoId))()
      const newTracks = await $api(getVideoTracksRoute(videoId))()
      tracks.value = newTracks.map(t => ({ ...t, subs: new Subtitles() }))
      curTrackId.value = tracks.value[0]?._id || ''
      tracks.value.forEach(async t => {
        const subs = await $api(getTrackInfosRoute(t._id))()
        t.subs.insertMany(subs.map(sub => ({
          _id: sub._id,
          startTime: sub.startTime,
          endTime: sub.endTime || 0,
          text: sub.text,
        })))
      })
    }

    onMounted(() => {
      tracksInit()
      addKeyControl()
      update()
    })

    // SRT
    const downloadSRT = () => {
      const srt = exportSRT(curSubs.value)
      // Solution on https://gist.github.com/danallison/3ec9d5314788b337b682
      const blob = new Blob([srt], { type: 'text/plain' })
      const ele = document.querySelector('#export') as HTMLAnchorElement
      ele.download = `Youtube_${videoId}.srt`
      ele.href = URL.createObjectURL(blob)
      ele.dataset.downloadurl = ['text/plain', ele.download, ele.href].join(':')
      ele.click()
      // setTimeout(function() { URL.revokeObjectURL(ele.href) }, 1500)
    }
    const uploadSRT = () => {
      const ele = document.querySelector('#import') as HTMLElement
      ele?.click()
    }
    const importSRT = async() => {
      const ele = document.querySelector('#import') as HTMLInputElement
      if (!ele.files || !ele.files.length) return
      const srt = await ele.files[0]?.text()
      const subs = parseSRT(srt)
      const track = await $api(newTrackRoute())({ videoId })
      tracks.value.push({ ...track, subs: new Subtitles(subs) })
      if (!curTrackId.value) curTrackId.value = tracks.value[0]?._id || ''
      await $api(newInfosRoute())(subs.map(sub => ({
        ...sub,
        trackId: curTrackId.value,
        videoId,
      })))
      ele.value = ''
      infoText.value = 'IMPORTED'
    }

    return {
      youtube,
      video,
      tracks,
      curTrackId,
      curTrack,
      curSubs,
      changeTrack,
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
      getTimeText,
      deleteTrack,
      newTrack,
      addSubtitle,
      deleteInSub,
      seek,
      triggerHelp,
      showHelp,
      downloadSRT,
      uploadSRT,
      importSRT,
    }
  },
})
</script>

<style lang="sass" scoped>
#video
  flex: 3 0 0
#subtitle
  flex: 1 0 0
#video-subs
  bottom: 0
#subs
  overflow-y: auto
</style>
