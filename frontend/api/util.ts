import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

const host = 'http://localhost:1233'

export enum METHODS {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

const defaultConfig = { withCredentials: true }

interface Response<Data> {
  data: Data
}

export const axiosRequest = <Data = undefined, Payload = undefined>(
  method: METHODS,
  path: string,
  config: AxiosRequestConfig = defaultConfig,
) => (payload?: Payload) => {
  const unifiedGet = <T = any, R = AxiosResponse<T>>(
    url: string,
    _data?: any,
    config?: AxiosRequestConfig,
  ) => axios.get<T, R>(url, config)
  const axiosMethod =
      method === METHODS.GET ? unifiedGet
    : method === METHODS.POST ? axios.post
    : method === METHODS.PUT ? axios.put
    : method === METHODS.DELETE ? axios.delete
    : null
  if (axiosMethod === null) throw new Error('No Such Method!')
  const axiosConfig = { ...defaultConfig, ...config }

  return new Promise((resolve: (data: Data) => void, reject: (err: string) => void) => {
    axiosMethod<Response<Data>>(host + path, payload, axiosConfig)
      .then(response => {
        resolve(response.data.data)
      })
      .catch(err => {
        const error = err.response?.data.error as string
        const fullError = `${err} \n${error}`
        reject(fullError)
      })
    })
}
