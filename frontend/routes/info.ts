import * as InfoApi from '@api/info'
import { axiosRequest, METHODS } from '@/routes/util'

export const getInfos = (ids: string[]) =>
  axiosRequest<InfoApi.GetInfos.Response>(
    METHODS.GET,
    `/infos?${ids.map(id => `ids[]=${id}`).join('&')}`,
  )

export const newInfos = () =>
  axiosRequest<InfoApi.PostInfos.Response, InfoApi.PostInfos.Request>(METHODS.POST, '/infos')

export const updateInfos = () =>
  axiosRequest<InfoApi.PutInfos.Response, InfoApi.PutInfos.Request>(METHODS.PUT, '/infos')

export const deleteInfos = (ids: string[]) =>
  axiosRequest<InfoApi.GetInfos.Response>(
    METHODS.DELETE,
    `/infos?${ids.map(id => `ids[]=${id}`).join('&')}`,
  )
