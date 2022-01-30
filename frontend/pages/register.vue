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
    div: span: | {{ response }}
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import axios from 'axios'

@Component
export default class extends Vue {
  email = ''
  password = ''
  response = ''

  register() {
    axios
      .post('http://localhost:1233/register', {
        email: this.email,
        password: this.password,
      })
      .then(res => {
        this.response = res ? res.data.success : ''
      })
      .catch((err) => {
        this.response = err.response?.data.error || ''
      })
  }
}
</script>

<style lang="sass" scoped></style>
