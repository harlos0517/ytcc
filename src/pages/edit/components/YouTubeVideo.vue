<template>
  <div>
    <youtube
      :video-id="videoId"
      resize
      resizeDelay="0"
      fitParent
      @playing="playing"
    ></youtube>
    <div id="ABC"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  name: 'YouTubeVideo',
  props: {
    videoId: String
  },
  components: {  },
  setup() {
    return {}
  },
  methods: {
    playing() {
      console.log('PLAYING')
    }
  }
})
</script>

<style scoped lang="scss">
</style>