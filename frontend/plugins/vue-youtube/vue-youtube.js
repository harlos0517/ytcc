import youtubePlayer from 'youtube-player'

import { PlayerStates } from './types'


export default {
  name: 'Youtube',
  props: {
    videoId: { type: String, default: '' },
    playerVars: { type: Object, default: () => ({}) },
    height: { type: [Number, String], default: 360 },
    width: { type: [Number, String], default: 640 },
    resize: { type: Boolean, default: false },
    resizeDelay: { type: Number, default: 100 },
    nocookie: { type: Boolean, default: false },
    fitParent: { type: Boolean, default: false },
  },
  data() {
    return {
      player: null,
      events: {
        [PlayerStates.UNSTARTED]: 'unstarted',
        [PlayerStates.PLAYING]: 'playing',
        [PlayerStates.PAUSED]: 'paused',
        [PlayerStates.ENDED]: 'ended',
        [PlayerStates.BUFFERING]: 'buffering',
        [PlayerStates.VIDEO_CUED]: 'cued',
      },
    }
  },
  methods: {
    playerReady(e) {
      this.$emit('ready', e.target)
    },
    playerStateChange(e) {
      if (e.data !== null && e.data !== PlayerStates.UNSTARTED)
        this.$emit(this.events[e.data], e.target)
    },
    playerError(e) {
      this.$emit('error', e.target)
    },
    updatePlayer(videoId) {
      if (!videoId) {
        this.player.stopVideo()
        return
      }

      if (this.playerVars.autoplay === 1) {
        this.player.loadVideoById({ videoId })
        return
      }

      this.player.cueVideoById({ videoId })
    },
  },
  watch: {
    videoId: 'updatePlayer',
    width(val) {
      this.player.setSize(val, this.height)
    },
    height(val) {
      this.player.setSize(this.width, val)
    },
  },
  beforeDestroy() {
    if (this.player !== null && this.player.destroy) {
      this.player.destroy()
      delete this.player
    }
  },
  mounted() {
    window.YTConfig = {
      host: 'https://www.youtube.com/iframe_api',
    }

    const host = this.nocookie
      ? 'https://www.youtube-nocookie.com'
      : 'https://www.youtube.com'

    this.player = youtubePlayer(this.$el, {
      host,
      width: this.width,
      height: this.height,
      videoId: this.videoId,
      playerVars: this.playerVars,
    })

    this.player.on('ready', this.playerReady)
    this.player.on('stateChange', this.playerStateChange)
    this.player.on('error', this.playerError)
  },
  render(h) {
    return h('div')
  },
}
