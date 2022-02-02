<template lang="pug">
  div
    div
      span: | E-mail
      input(type="text" name="email" v-model="email" required)
    div
      span: | Password
      input(type="password" name="password" v-model="password" required)
    div
      span: | Password Again
      input(type="password" name="password_again" required)
    div
      button(@click="register()"): | REGISTER
</template>

<script lang="ts">
import { defineComponent, ref } from '@nuxtjs/composition-api'
import registerRoute from '~/api/user/register'

export default defineComponent({
  setup() {
    const email = ref('')
    const password = ref('')

    const register = () => {
      registerRoute()({
        email: email.value,
        password: password.value,
      })
    }

    return { email, password, register }
  },
})
</script>

<style lang="sass" scoped></style>
