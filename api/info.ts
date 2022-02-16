import { InfoStyle } from "./style";

export type Info = {
  videoId: string
  trackId: string
  userId: string
  text: string
  startTime: number // in seconds
  endTime?: number // in seconds
  style?: InfoStyle
}

export type InfoRequest = Omit<Info, 'userId'>

export type InfoResponse = Info & { _id: string }

export namespace GetInfos {
  export type Response = (InfoResponse | null)[]
}

export namespace PostInfos {
  export type Request = InfoRequest[]
  export type Response = InfoResponse[]
}

export namespace PutInfos {
  export type Request = (Partial<InfoRequest> & { _id: string })[]
  export type Response = (InfoResponse | null)[]
}

export namespace DeleteInfos {
  export type Request = ({ _id: string })[]
}