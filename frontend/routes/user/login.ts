import { Login } from '@api/user'
import { axiosRequest, METHODS } from '@/routes/util'

const login = () => axiosRequest<undefined, Login.Request>(METHODS.POST, '/login')

export default login
