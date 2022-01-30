/* eslint-disable @typescript-eslint/no-explicit-any */

import { User } from '@/schema/user' // export interface User { _id: string, ... }

declare module 'passport' {
  interface Authenticator {
    serializeUser<TID>(fn: (user: User, done: (err: any, id?: TID) => void) => void): void
  }
}

declare module 'express-session' {
  export interface SessionData {
    user: { [key: string]: any }
  }
}
