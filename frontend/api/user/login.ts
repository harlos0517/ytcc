import { axiosRequest, METHODS } from '@/api/util'

type Data = {
  email: string,
  password: string
}

type Payload = {
  email: string,
  password: string
}

const login = () => axiosRequest<Data, Payload>(METHODS.POST, '/login')

export default login
