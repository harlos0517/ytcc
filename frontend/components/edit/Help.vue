<template lang="pug">
  #help.position-absolute.rounded
    .wrap.p-5
      h3.text-warning
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
      p
        | YTCC is a project aiming to be an online collaboratable closed caption editing tool for YouTube videos.
        | The ultimate goal of this project is to let people understand videos and alike from all over the world,
        | stimulating "
        a(href='https://www.youtube.com/watch?v=tIU0xG-lXkQ&t=5917s' target="_blank") culture cross-pollination
        | ".

      h4.text-danger [ WARNING ]
      p.
        This website is still in testing state and may be unstable.
        The subtitles you created are not guaranteed to be well preserved.
        Remember to Export SRT once in a while to ensure you don't lose your subtitles.

      h4.text-info [ Keyboard Shortcuts ]
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
      h4.text-info [ Planning Features ]
      ul
        li Audio Render from backend &amp; auto CC time generate
        li CC font color, style, position
        li CC collab/translation
      h4.text-info [ About ]
      p
        | This webpage is created and designed by
        |
        a(href='https://hackmd.io/@DeemoHarlos/share' target="_blank") Deemo Harlos
        br
        | This is an open-source project.
        | This means ANYONE can contribute to this project,
        | either by testing, discussing, reporting issues, giving advices or create pull requests.
        br
        a(href='https://github.com/DeemoHarlos/ytcc' target="_blank") Github Repo
        |  |
        |
        a(href='https://github.com/DeemoHarlos/ytcc/issues/new' target="_blank") Report Bugs or Issues
        br
        br
        | Buy me a coffee! Thanks for your support!
        |
        a(href='https://ko-fi.com/harlosmusic' target="_blank") Ko-fi
        |  |
        |
        a(href='https://www.patreon.com/HarlosMusic' target="_blank") Patreon
        br
        | (Yes that's me, I also make a living from music!)
        br
        | Contact me on
        |
        a(href='https://twitter.com/HarlosMusic' target="_blank") Twitter
        |
        | or
        |
        a(href='https://discord.gg/6r4bvhr' target="_blank") Discord
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
  &>.wrap
    max-height: 100%
    overflow: auto
  #help-close
    right: 1.5rem
    top: 1rem
</style>
