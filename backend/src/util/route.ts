/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextFunction, Request, RequestHandler, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'

import { ResponseType } from '@api/index'

import { PromiseOptional } from './general'

type TypedRequestBody<T, U> = Request<ParamsDictionary, ResponseType<T>, U>

type TypedResponseBody<T> = Response<ResponseType<T>>

export const typedRequestHandler = <RES = undefined, REQ = undefined>(
  func: (
    req: TypedRequestBody<RES, REQ>,
    res: TypedResponseBody<RES>,
    next: NextFunction
  ) => PromiseOptional<void | any>,
) => (
  (
    req: TypedRequestBody<RES, REQ>,
    res: TypedResponseBody<RES>,
    next: NextFunction,
  ) => {
    func(req, res, next)
  }
) as RequestHandler

export const getUserId = (req: Request) => req.session.user?._id as string | undefined

// eslint-disable-next-line @typescript-eslint/ban-types
export const withUserId = <T = {}>(req: Request, obj: T) => {
  const userId = getUserId(req)
  return { ...obj, ...(userId ? { userId } : {}) } as (T & { userId?: string })
}
