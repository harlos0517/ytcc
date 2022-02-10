import { axiosRequest, METHODS } from '@/routes/util'

type Payload = {
  email: string,
  password: string
}

const register = () => axiosRequest<null, Payload>(METHODS.POST, '/register')

export default register
