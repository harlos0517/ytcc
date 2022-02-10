<template lang="pug">
  div
    input(type="text" v-model="videoLink")
    button(@click="newVideo()"): | CREATE
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from '@nuxtjs/composition-api'
// import { StoreState } from '@/store'

import newVideoRoute from '@/routes/video/newVideo'

export default defineComponent({
  setup() {
    // const store = useStore() as StoreState

    const videoLink = ref('')

    onMounted(() => {})

    const newVideo = () => {
      newVideoRoute()({ videoLink: videoLink.value }).then()
    }

    return { videoLink, newVideo }
  },
})
</script>

<style lang="sass" scoped></style>
