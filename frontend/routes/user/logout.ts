import { axiosRequest, METHODS } from '@/routes/util'

const logout = () => axiosRequest(METHODS.POST, '/logout')

export default logout
