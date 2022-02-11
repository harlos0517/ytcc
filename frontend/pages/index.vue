<template lang="pug">
  div
    input(type="text" v-model="videoLink")
    button(@click="newVideo()"): | CREATE
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, useRouter } from '@nuxtjs/composition-api'
// import { StoreState } from '@/store'

import { newVideo as newVideoRoute } from '@/routes/video'

export default defineComponent({
  setup() {
    // const store = useStore() as StoreState
    const router = useRouter()

    const videoLink = ref('')

    onMounted(() => {})

    const newVideo = () => {
      newVideoRoute()({ videoLink: videoLink.value }).then(res => {
        router.push('/edit?videoId=' + res._id)
      })
    }

    return { videoLink, newVideo }
  },
})
</script>

<style lang="sass" scoped></style>
