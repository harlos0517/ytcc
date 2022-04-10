import * as TrackApi from '@api/track'
import { axiosRequest, METHODS } from '@/middleware/api'

export const getTrack = (trackId: string) =>
  axiosRequest<TrackApi.GetTrack.Response>(METHODS.GET, '/track/' + trackId)

export const getMyTracks = () =>
  axiosRequest<TrackApi.GetMyTracks.Response>(METHODS.GET, '/track/me')

export const getPublicTracks = (videoId: string) =>
  axiosRequest<TrackApi.GetPublicTracks.Response>(METHODS.GET, '/track/public?videoId=' + videoId)

export const getTrackInfos = (trackId: string) =>
  axiosRequest<TrackApi.GetTrackInfos.Response>(METHODS.GET, `/track/${trackId}/infos`)

export const newTrack = () =>
  axiosRequest<TrackApi.PostTrack.Response, TrackApi.PostTrack.Request>(METHODS.POST, '/track')

export const updateTrack = () =>
  axiosRequest<TrackApi.PutTrack.Response, TrackApi.PutTrack.Request>(METHODS.PUT, '/track')

export const deleteTrack = (trackId: string) =>
  axiosRequest(METHODS.DELETE, '/track/' + trackId)
