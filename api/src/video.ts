import { TrackResponse } from './track'
import { UserResponse } from './user'

export type Video = {
  type: string
  handle: string
  url: string
  length: number
}

type VideoResponse = Video & { _id: string }

export namespace GetVideoByHandle {
  export type Response = VideoResponse
}

export namespace GetVideoById {
  export type Response = VideoResponse
}

export namespace GetVideoTracks {
  export type Response = TrackResponse[]
}

export namespace GetVideoPublicTracks {
  export type Response = (TrackResponse & { user: UserResponse | null })[]
}

export namespace GetMyVideos {
  export type Response = VideoResponse[]
}

export namespace PostVideo {
  export type Request = { videoLink: string }
  export type Response = VideoResponse
}

export namespace PutVideo {
  export type Request = Partial<VideoResponse> & { _id: string }
  export type Response = VideoResponse
}
