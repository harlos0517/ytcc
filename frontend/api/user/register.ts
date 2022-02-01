import { axiosRequest, METHODS } from '@/api/util'

type Payload = {
  email: string,
  password: string
}

const register = () => axiosRequest<null, Payload>(METHODS.POST, '/register')

export default register
