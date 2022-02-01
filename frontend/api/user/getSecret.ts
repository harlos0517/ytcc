import { axiosRequest, METHODS } from '@/api/util'

const getSecret = () => axiosRequest<string>(METHODS.GET, '/secret')

export default getSecret
