<template lang="pug">
  div#header.p-2.d-flex.flex-row.align-items-center
    .flex-fill.h2.m-0 YTCC
    //- button.btn.btn-secondary.m-1(@click="saveSubtitles") Save
    //- button.btn.btn-secondary.m-1(@click="exportSRT") Export SRT
    //- button.btn.btn-secondary.m-1(@click="importSRT") Import SRT
    //- a#export.d-none
    //- input#import.d-none(type='file' @change='getSRT')
    button.btn.btn-secondary.m-1(@click="triggerHelp") Help
</template>

<script lang="ts">
import { defineComponent, PropType } from '@nuxtjs/composition-api'
// import { StoreState } from '@/store'

export default defineComponent({
  props: {
    triggerHelp: { type: Function as PropType<() => void>, required: true },
  },
  setup() {
    // const store = useStore() as StoreState

    return {}
  },
})
</script>

<style lang="sass" scoped></style>
