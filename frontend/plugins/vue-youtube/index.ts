import Vue from 'vue'
import Youtube from './vue-youtube'

Vue.use(vue => {
  vue.component('Youtube', Youtube)
})

export {
  PlayerStates,
  PlayerStateString,
  mapStateString,
  YouTubePlayer,
} from './types'
