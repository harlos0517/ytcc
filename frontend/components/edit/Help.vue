<template lang="pug">
  #help.position-absolute.rounded
    .wrap.p-5
      h3
        b Y
        | ou
        b T
        | ube Video
        |
        b C
        | losed
        |
        b C
        | aption Tool
      p.
        YTCC allows users to create subtitles for any video on YouTube.
        This project ultimately aims for letting audience from all over the world understand streams from vTubers,
        and allows clippers to make clips easier and faster.

      h4 [ WARNING ]
      p.
        This website is still in testing state and may be unstable.
        The subtitles you created are not guaranteed to be well preserved.
        Remember to Export SRT once in a while to ensure you don't lose your subtitles.

      h4 [ Keyboard Shortcuts ]
      span These only work when focus is outside the video player.
      ul
        li Ctrl + Space : Play / Pause
        li Ctrl + Enter : Add subtitles
        li Ctrl + E : Export SRT
        li Ctrl + I : Import SRT
        li Ctrl + H : Help
        li (Timeline) mousewheel : Scroll
        li (Timeline) Ctrl + mousewheel : Zoom
        li (Timeline) drag : Move Subtitle
      h4 [ Planning Features ]
      ul
        li Audio Render from backend &amp; auto CC time generate
        li CC font color, style, position
        li CC collab/translation
      h4 [ About ]
      p
        | This webpage is created and designed by
        |
        a(href='https://hackmd.io/@DeemoHarlos/share') Deemo Harlos
        br
        | This is an open-source project.
        | This means ANYONE can contribute to this project,
        | either by testing, discussing, reporting issues, giving advices or create pull requests.
        br
        | Github Repo:
        |
        a(href='https://github.io/DeemoHarlos/ytcc') https://github.io/DeemoHarlos/ytcc
        |  |
        |
        a(href='https://github.com/DeemoHarlos/ytcc/issues/new') Report Bugs or Issues
        br
        br
        | Buy me a coffee! Thanks for your support!
        |
        a(href='https://ko-fi.com/harlosmusic') Ko-fi
        |  |
        |
        a(href='https://www.patreon.com/HarlosMusic') Patreon
        br
        | (Yes that's me, I also make a living from music!)
        br
        | Contact me on
        |
        a(href='https://twitter.com/HarlosMusic') Twitter
        |
        | or
        |
        a(href='https://discord.gg/6r4bvhr') Discord
    button#help-close.btn-close.close.btn-close-white.position-absolute(type='button' aria-label='Close' @click='triggerHelp')
      span(aria-hidden="true") &times;
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api'
// import { StoreState } from '@/store'

export default defineComponent({
  props: {
    triggerHelp: { type: Function as PropType<() => void>, required: true },
  },
})
</script>

<style lang="sass" scoped>
#help
  left: 20%
  right: 20%
  top: 10%
  bottom: 10%
  background-color: #000000DD
  z-index: 20
#help>.wrap
  max-height: 100%
  overflow: auto
#help-close
  right: 1.5rem
  top: 1rem
</style>
