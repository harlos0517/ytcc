<template lang="pug">
  div
    div
      span: | E-mail
      input(type="text" name="email" v-model="email" required)
    div
      span: | Password
      input(type="password" name="password" v-model="password" required)
    div
      button(@click="login()"): | LOGIN
    div: span: | {{ response }}
    div
      button(@click="refresh()"): | REFRESH
    div: span: | {{ secret }}
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import axios from 'axios'

@Component
export default class extends Vue {
  email = ''
  password = ''
  response = ''
  secret = ''

  login() {
    axios
      .post(
        'http://localhost:1233/login',
        {
          email: this.email,
          password: this.password,
        },
        { withCredentials: true },
      )
      .then((res) => {
        this.response = res ? res.data.success : ''
      })
      .catch((err) => {
        this.response = err.response?.data.error || ''
      })
  }

  refresh() {
    axios
      .get('http://localhost:1233/secret', { withCredentials: true })
      .then((res) => {
        this.secret = res ? res.data.success : ''
      })
      .catch((err) => {
        this.secret = err.response?.data.error || ''
      })
  }
}
</script>

<style lang="sass" scoped></style>
