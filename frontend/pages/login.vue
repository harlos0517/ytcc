<template lang="pug">
  div
    div(v-if="loggedIn")
      div: span {{ userEmail }}
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
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { UserState } from '@/store/user'
import getMe from '@/api/user/getMe'
import getSecret from '@/api/user/getSecret'

@Component
export default class extends Vue {
  email = ''
  password = ''
  secret = ''

  get userEmail() {
    return (this.$store.state.user as UserState).email
  }

  get loggedIn() {
    return (this.$store.state.user as UserState).loggedIn
  }

  mounted() {
    this.getMe()
    this.refresh()
  }

  getMe = async() => {
    const { email } = await getMe()()
    this.$store.commit('user/setUser', email)
  }

  login = () => {
    console.log(this.email, this.password) // empty string
    this.$store.dispatch('user/login', {
      email: this.email,
      password: this.password,
    })
  }

  logout = () => {
    this.$store.dispatch('user/logout')
  }

  refresh = () => {
    getSecret()()
  }
}
</script>

<style lang="sass" scoped></style>
