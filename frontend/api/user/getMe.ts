import { axiosRequest, METHODS } from '@/api/util'

const getMe = () => axiosRequest<{ email: string }>(METHODS.GET, '/user/me')

export default getMe
