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
    div(v-for="(res, i) in response" :key="i")
      span RESPONSE: {{ res }}
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import axios from 'axios'
import { axiosRequest, METHODS } from '@/util/api'

@Component
export default class extends Vue {
  user = null as any
  email = ''
  password = ''
  response = [] as string[]
  secret = ''

  mounted() {
    this.getMe()
    this.refresh()
  }

  getMe() {
    axiosRequest({
      method: METHODS.GET,
      path: '/user/me',
      callbacks: {
        onSuccess: data => { this.user = data },
        onError: _ => { this.user = null },
      }
    })
  }

  login() {
    axiosRequest({
      method: METHODS.POST,
      path: '/login',
      payload: {
        email: this.email,
        password: this.password,
      },
      callbacks: { onSuccess: data => { this.user = data } },
    })
  }

  logout() {
    axiosRequest({
      method: METHODS.POST,
      path: '/logout',
      callbacks: { onSuccess: _ => { this.user = null } },
    })
  }

  refresh() {
    axiosRequest({
      method: METHODS.GET,
      path: '/secret',
      callbacks: {
        onSuccess: data => { this.secret = data },
        onError: _ => { this.secret = '' },
      },
    })
  }
}
</script>

<style lang="sass" scoped></style>
