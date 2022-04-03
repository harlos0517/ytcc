import { InfoResponse } from "./info";
import { InfoStyle } from "./style";

export type Track = {
  videoId: string
  userId: string
  type: string
  name: string
  public: boolean
  defaultStyle?: InfoStyle
}

export type TrackResponse = Track & { _id: string }

export namespace GetTrack {
  export type Response = TrackResponse
}

export namespace GetMyTracks {
  export type Response = TrackResponse[]
}

export namespace GetPublicTracks {
  export type Response = TrackResponse[]
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

export namespace DeleteTrack {}
