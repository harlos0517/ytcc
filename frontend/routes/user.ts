import * as UserApi from '@api/user'
import { axiosRequest, METHODS } from '@/routes/util'

export const getMe = () =>
  axiosRequest<UserApi.GetMe.Response>(METHODS.GET, '/user/me')

export const getSecret = () =>
  axiosRequest<UserApi.GetSecret.Response>(METHODS.GET, '/secret')

export const login = () =>
  axiosRequest<UserApi.Login.Response, UserApi.Login.Request>(METHODS.POST, '/login')

export const loginGoogle = () =>
  axiosRequest(METHODS.POST, '/login/google')

export const logout = () =>
  axiosRequest(METHODS.POST, '/logout')

export const register = () =>
  axiosRequest<UserApi.Register.Response, UserApi.Register.Request>(METHODS.POST, '/register')
