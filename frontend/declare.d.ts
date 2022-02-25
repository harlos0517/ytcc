import { NuxtAxiosInstance } from '@/middleware/api'

declare module '@nuxt/types' {
  interface Context {
    $api: <Payload, Data>(
      axiosRoute: (
        axios: NuxtAxiosInstance, payload?: Payload) => Promise<Data>
    ) =>
      (payload?: Payload) => Promise<Data>
  }
}
