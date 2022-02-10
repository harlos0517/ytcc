import { axiosRequest, METHODS } from '@/routes/util'

const getMe = () => axiosRequest<{ email: string }>(METHODS.GET, '/user/me')

export default getMe
