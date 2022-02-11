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
import { defineComponent, ref, computed, useStore, onMounted } from '@nuxtjs/composition-api'
import { StoreState } from '@/store'

import { getMe as getMeRoute, getSecret as getSecretRoute } from '@/routes/user'

export default defineComponent({
  setup() {
    const store = useStore() as StoreState
    const userStore = store.state.user

    const email = ref('')
    const password = ref('')
    const secret = ref('')
    const userEmail = computed(() => userStore.email)
    const loggedIn = computed(() => userStore.loggedIn)

    onMounted(() => {
      getMe()
      refresh()
    })

    const getMe = async() => {
      const { email } = await getMeRoute()()
      store.commit('user/setUser', email)
    }

    const login = () => {
      store.dispatch('user/login', {
        email: email.value,
        password: password.value,
      })
    }

    const logout = () => {
      store.dispatch('user/logout')
    }

    const refresh = () => {
      getSecretRoute()().then(newSecret => {
        secret.value = newSecret
      }).catch(_ => { secret.value = '' })
    }

    return {
      email, password, secret, userEmail, loggedIn, login, logout, refresh,
    }
  },
})
</script>

<style lang="sass" scoped></style>
