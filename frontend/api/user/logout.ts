import { axiosRequest, METHODS } from '@/api/util'

const logout = () => axiosRequest(METHODS.POST, '/logout')

export default logout
