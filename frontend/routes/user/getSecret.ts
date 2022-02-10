import { axiosRequest, METHODS } from '@/routes/util'

const getSecret = () => axiosRequest<string>(METHODS.GET, '/secret')

export default getSecret
