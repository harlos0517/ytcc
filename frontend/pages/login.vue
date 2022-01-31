<template lang="pug">
  div
    div(v-if="user")
      div: span {{ user ? user.email : 'Please Login' }}
      div
        button(@click="logout()") LOGOUT
    div(v-else)
      div
        span E-mail
        input(type="text" name="email" v-model="email" required)
      div
        span Password
        input(type="password" name="password" v-model="password" required)
      div
        button(@click="login()") LOGIN
    div
      button(@click="refresh()") REFRESH
    div: span SECRET: {{ secret }}
    div: span RESPONSE: {{ response }}
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import axios from 'axios'

@Component
export default class extends Vue {
  user = null as any
  email = ''
  password = ''
  response = ''
  secret = ''

  mounted() {
    this.getMe()
    this.refresh()
  }

  getMe() {
    axios
      .get('http://localhost:1233/user/me', { withCredentials: true })
      .then((res) => {
        this.user = res.data.data || ''
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error(err)
        this.user = null
      })
  }

  async login() {
    await axios
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
        this.getMe()
      })
      .catch((err) => {
        this.response = err.response?.data.error || ''
      })
  }

  logout() {
    axios
      .post('http://localhost:1233/logout', {}, { withCredentials: true })
      .then((res) => {
        this.response = res ? res.data.success : ''
        this.user = null
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
