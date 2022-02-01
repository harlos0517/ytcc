import { axiosRequest, METHODS } from '@/api/util'

type Payload = {
  email: string,
  password: string
}

const login = () => axiosRequest<undefined, Payload>(METHODS.POST, '/login')

export default login
