import { axiosRequest, METHODS } from '@/routes/util'

type Data = {
  _id: string
  type: string
  handle: string
  url: string
  length: number
}

type Payload = {
  videoLink: string,
}

const newVideo = () => axiosRequest<Data, Payload>(METHODS.POST, '/video')

export default newVideo
