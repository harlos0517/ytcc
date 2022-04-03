import * as VideoApi from '@api/video'
import { axiosRequest, METHODS } from '@/middleware/api'

export const newVideo = () =>
  axiosRequest<VideoApi.PostVideo.Response, VideoApi.PostVideo.Request>(METHODS.POST, '/video')

export const getVideoPublicTracks = (videoId: string) =>
  axiosRequest<VideoApi.GetVideoPublicTracks.Response>(METHODS.GET, `/video/${videoId}/tracks/public`)

export const getMyVideos = () =>
  axiosRequest<VideoApi.GetMyVideos.Response>(METHODS.GET, '/videos/me')

export const getVideoById = (videoId: string) =>
  axiosRequest<VideoApi.GetVideoById.Response>(METHODS.GET, '/video/' + videoId)

export const getVideoTracks = (videoId: string) =>
  axiosRequest<VideoApi.GetVideoTracks.Response>(METHODS.GET, `/video/${videoId}/tracks`)

