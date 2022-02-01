import axios, { AxiosRequestConfig } from 'axios'

const host = 'http://localhost:1233'

export enum METHODS {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE'
}

const defaultOptions = { withCredentials: true }
const defaultSuccessCallback = (data: any) => {}
const defaultErrorCallback = (err: string) => {}

export const axiosRequest = (option: {
  method: METHODS,
  path: string,
  payload?: any,
  options?: AxiosRequestConfig,
  callbacks?: {
    onSuccess?: (data: any) => void,
    onError?: (err: string) => void
  }
}) => {
  const { method, path, payload = null, options = defaultOptions, callbacks } = option
  const axiosMethod =
    method === METHODS.GET ? (
      url: string,
      _data: any,
      config?: AxiosRequestConfig
    ) => axios.get(url, config) :
    method === METHODS.POST ? axios.post :
    method === METHODS.PUT ? axios.put :
    method === METHODS.DELETE ? axios.delete : null
  if (axiosMethod === null) throw 'No Such Method!'

  const axiosConfig = { ...defaultOptions, ...options }

  if (callbacks) {
    const onSuccess = callbacks.onSuccess || defaultSuccessCallback
    const onError = callbacks.onError || defaultErrorCallback
    console.log(options)
    axiosMethod(host + path, payload, axiosConfig)
      .then(response => { onSuccess(response.data.data) })
      .catch(err => {
        const error = err.response?.data.error
        const fullError = `${err} \n${error}`
        console.error(fullError)
        onError(fullError)
      })

  } else {
    return new Promise(async (resolve, _reject) => {
      try {
        const response = await axiosMethod(host + path, payload, axiosConfig)
        resolve(response.data.data)
      } catch (err: any) {
        const error = err.response?.data.error
        const fullError = `${err} \n${error}`
        console.error(fullError)
        resolve(err?.response?.data)
      }
    })
  }
}
