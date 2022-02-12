import { InfoResponse } from "./info";
import { InfoStyle } from "./style";

export type Track = {
  video_id: string
  user_id: string
  type: string
  default_style?: InfoStyle
}

export type TrackResponse = Track & { _id: string }

export namespace GetTrack {
  export type Response = TrackResponse
}

export namespace GetTrackInfos {
  export type Response = InfoResponse[]
}

export namespace PostTrack {
  export type Request = { videoId: string }
  export type Response = TrackResponse
}

export namespace PutTrack {
  export type Request = Partial<TrackResponse> & { _id: string }
  export type Response = TrackResponse
}
