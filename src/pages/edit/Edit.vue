<template>
  <q-page class="row items-center justify-evenly">
    <YouTubeVideo videoId="sShMA85pv8M" class="fit"></YouTubeVideo>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

import YouTubeVideo from './components/YouTubeVideo.vue'

export default defineComponent({
  name: 'PageIndex',
  components: { YouTubeVideo },
  setup() {
    return {}
  }
})
</script>
