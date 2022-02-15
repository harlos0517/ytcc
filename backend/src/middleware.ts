import { Request, RequestHandler } from 'express'
import { Profile, VerifyCallback } from 'passport-google-oauth20'

import { UserModel } from '@/schema/user'

// auth middleware
export const auth: RequestHandler = (req, res, next) => {
  if (req.isAuthenticated()) next()
  else res.status(401).send({ error: 'Not Authenticated' })
}

export const googleOauthCallback = (
  req: Request,
  accessToken: string,
  refreshToken: string,
  profile: Profile,
  done: VerifyCallback,
) => {
  UserModel.findOne({ google_id: profile.id }).then(user => {
    if (!user) {
      if(!profile.emails) return done('No email provided')
      UserModel.create({
        google_id: profile.id,
        email: profile.emails[0].value,
      }).then(user => {
        req.session.user = user
        done(null, user)
      })
    } else {
      req.session.user = user
      done(null, user)
    }
  })
}
