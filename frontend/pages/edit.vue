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
        VideoView(
          ref="playerRef"
          :videoId="video ? video.handle : ''"
          :activeSubs="activeSubs"
          :changeState="changeState"
          :ready="onReady"
          :cued="onCued"
        )
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
                :class="{ active: t._id === curTrackId }"
                @click="curTrackId = t._id"
              )
                span {{ t.name }}
                button.btn-close.close.btn-close-white(
                  v-if="t._id === curTrackId"
                  type="button"
                  aria-label="Close"
                  @click="deleteTrack(t._id, i)"
                )
                  span(aria-hidden="true") &times;
            li.nav-item
              a#add-track-btn.nav-link(@click="newTrack")
                span(v-if="!tracks.length") Add track
                span(v-else) +
        EditTrackInfo(v-if="curTrack" :track="curTrack")
        #subs.flex-fill.position-relative(ref="subsRef")
          .wrap.position-absolute.w-100
            EditSubtitle(
              v-for="(sub, i) in curSubs"
              ref="subRef"
              :key="i"
              :subtitle="sub"
              :seek="seek"
              :videoLength="videoLength"
              :deleteInSub="deleteInSub(sub)"
            )
            button.btn.btn-dark.w-100.text-center.p-3(
              v-if="curTrackId"
              type="button"
              @click="addSubtitle()"
            )
              span(v-if="!curSubs.length") Add subtitle
              span(v-else) +
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
  useRouter,
  useContext,
} from '@nuxtjs/composition-api'
import Vue from 'vue/types/umd'

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
    const router = useRouter()
    const videoId = route.value.query.videoId as string
    const video = ref<Video | null>(null)
    const { $api } = useContext()

    const playerRef = ref<(HTMLElement & { player: YouTubePlayer }) | null>(null)
    const player = computed(() => playerRef.value?.player)

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
    const activeSubs = computed(
      () => tracks.value.map(t => t.subs.data.filter(x => x.active).reverse()).flat(),
    )
    const subsRef = ref<HTMLElement | null>(null)
    const subRef = ref<Vue[]>([])

    const changeTrack = (id: string) => {
      curTrackId.value = id
    }

    // player events
    const changeState = (newState: PlayerStates) => {
      state.value = newState
      infoText.value = mapStateString(state.value)
    }

    const onReady = async() => {
      videoLength.value = await player.value?.getDuration() || 60
    }

    const onCued = async() => {
      videoLength.value = await player.value?.getDuration() || 60
    }


    // display function
    const getTimeText = (time: number) =>
      getTimeString(time, videoLength.value > 3600)

    // track operation
    const newTrack = async() => {
      const track = await $api(newTrackRoute())({ videoId })
      tracks.value.push({ ...track, subs: new Subtitles() })
      curTrackId.value = track._id || ''
    }
    const deleteTrack = async(id: string, i: number) => {
      if (confirm('Are you sure to delete this track?')) {
        await $api(deleteTrackRoute(id))()
        tracks.value.splice(i, 1)
        curTrackId.value =
          tracks.value[i]?._id || tracks.value[i - 1]?._id || ''
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
    const scrollSubs = async() => {
      if (player.value && await player.value.getPlayerState() === 1) {
        const index = curSubs.value.findIndex(s => s.active)
        const el = subRef.value[index]?.$el
        if (el && subsRef.value && !isElementInViewport(el as HTMLElement, subsRef.value))
          subRef.value[index]?.$el.scrollIntoView()
      }
    }
    const isElementInViewport = (el: HTMLElement, parent: HTMLElement) => {
      var rect = el.getBoundingClientRect()
      var parentRect = parent.getBoundingClientRect()
      return (
        rect.top >= parentRect.top &&
        rect.left >= parentRect.left &&
        rect.bottom <= parentRect.bottom &&
        rect.right <= parentRect.right
      )
    }
    const update = () => {
      updateCursor()
      scrollSubs()
      window.requestAnimationFrame(update)
    }

    // on mounted
    const listenKey = (key: string, ctrl: boolean, f: () => void) => {
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
      try {
        video.value = await $api(getVideoByIdRoute(videoId))()
      } catch (err) {
        if (err === 'Not Authenticated') {
          router.push('/')
          return
        }
      }
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
        trackId: track._id,
        videoId,
      })))
      curTrackId.value = track._id
      ele.value = ''
      infoText.value = 'IMPORTED'
    }

    return {
      video,
      tracks,
      curTrackId,
      curTrack,
      curSubs,
      activeSubs,
      subsRef,
      subRef,
      changeTrack,
      state,
      infoText,
      videoLength,
      playerRef,
      player,
      cursor,
      changeState,
      onReady,
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
  #tracks
    a.nav-link.btn:not(.active)
      color: white
#video-subs
  bottom: 0
  pointer-events: none
  span
    background-color: #000000BB
    border-radius: 5px
#subs
  overflow-y: auto
#add-track-btn
  text-decoration: none
  color: inherit
</style>
