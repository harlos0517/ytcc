import * as VideoApi from '@api/video'
import { axiosRequest, METHODS } from '@/routes/util'

export const newVideo = () =>
  axiosRequest<VideoApi.PostVideo.Response, VideoApi.PostVideo.Request>(METHODS.POST, '/video')

export const getVideoById = (videoId: string) =>
  axiosRequest<VideoApi.GetVideoById.Response>(METHODS.GET, '/video/' + videoId)

