export interface ResponseData<Data> {
  data: Data
}
export interface ResponseError {
  error: string
}

export type ResponseType<Data> = ResponseData<Data> | ResponseError

