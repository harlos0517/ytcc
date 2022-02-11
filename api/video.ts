import { TrackResponse } from './track'

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

export namespace PostVideo {
  export type Request = { videoLink: string }
  export type Response = VideoResponse
}

export namespace PutVideo {
  export type Request = Partial<VideoResponse> & { _id: string }
  export type Response = VideoResponse
}
