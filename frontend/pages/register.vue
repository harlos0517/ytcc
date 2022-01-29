<template lang="pug">
  form(action="http://localhost:1233/register" method="post")
    div
      span: | E-mail
      input(type="text" name="email" required)
    div
      span: | Password
      input(type="password" name="password" required)
    div
      span: | Password Again
      input(type="password" name="password_again" required)
    div
      input(type="submit")
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class extends Vue {
}
</script>

<style lang="sass" scoped></style>
