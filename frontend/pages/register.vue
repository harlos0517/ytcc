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
      input(type="password" name="passwordAgain" required)
    div
      button(@click="register()"): | REGISTER
</template>

<script lang="ts">
import { defineComponent, ref, useContext } from '@nuxtjs/composition-api'
import { register as registerRoute } from '@/routes/user'

export default defineComponent({
  setup() {
    const { $api } = useContext()

    const email = ref('')
    const password = ref('')

    const register = () => {
      $api(registerRoute())({
        email: email.value,
        password: password.value,
      })
    }

    return { email, password, register }
  },
})
</script>

<style lang="sass" scoped></style>
