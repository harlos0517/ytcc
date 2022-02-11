import { InfoStyle } from "./style";

export type Info = {
  video_id: string
  track_id: string
  user_id: string
  text: string
  start_time: number // in seconds
  end_time?: number // in seconds
  style?: InfoStyle
}

export type InfoResponse = Info & { _id: string }

export namespace GetInfos {
  export type Response = (InfoResponse | null)[]
}

export namespace PostInfos {
  export type Request = Info[]
  export type Response = InfoResponse[]
}

export namespace PutInfos {
  export type Request = (Partial<InfoResponse> & { _id: string })[]
  export type Response = (InfoResponse | null)[]
}
