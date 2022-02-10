<template lang="pug">
  .p-2.d-flex.flex-row.align-items-center.rounded(
    :class="{'bg-secondary': sub.active}"
  )
    .time.me-3.font-monospace(@click="seek(sub.start)")
      .start-time
        span {{ getTimeString(sub.start) }}:
      .end-time
        span {{ getTimeString(sub.end) }}:
    textarea.text.p-0.bg-dark.text-white.flex-fill.me-3(
      placeholder="Enter Subtitles Here"
      v-model="sub.text"
      @blur="saveSubtitles"
    )
    button.btn-close.close.btn-close-white(
      type='button'
      aria-label='Close'
      @click='deleteSubtitle(sub)'
    )
</template>

<script lang="ts">
import { defineComponent, ref, computed, useStore, onMounted } from '@nuxtjs/composition-api'
// import { StoreState } from '@/store'

export default defineComponent({
  setup() {
    // const store = useStore() as StoreState

    onMounted(() => {})

    return {}
  },
})
</script>

<style lang="sass" scoped></style>
