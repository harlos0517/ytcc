import * as TrackApi from '@api/track'
import { axiosRequest, METHODS } from '@/routes/util'

export const getTrack = (trackId: string) =>
  axiosRequest<TrackApi.GetTrack.Response>(METHODS.GET, '/track/' + trackId)

export const getTrackInfos = (trackId: string) =>
  axiosRequest<TrackApi.GetTrackInfos.Response>(METHODS.GET, `/track/${trackId}/infos`)

export const newTrack = () =>
  axiosRequest<TrackApi.PostTrack.Response, TrackApi.PostTrack.Request>(METHODS.POST, '/track')
