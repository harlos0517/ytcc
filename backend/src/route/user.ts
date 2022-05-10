import express from 'express'
import passport from 'passport'

import { UserModel } from '@/schema/user'
import * as UserApi from '@api/user'

import { auth } from '@/middleware'

import { typedRequestHandler } from '@/util/route'

const router = express.Router()

router.post('/register',
  typedRequestHandler<undefined, UserApi.Register.Request>((req, res) => {
    const { email, password } = req.body
    UserModel.register(new UserModel({ email }), password, async(err, _user) => {
      if (err) res.status(400).send({ error: 'Register Error: \n' + err })
      else res.sendStatus(200)
    })
  }),
)
/*
router.post('/login', async(req, res, _next) => {
  const { email, password } = req.body as UserApi.Login.Request
  const { error, user } = await UserModel.authenticate()(email, password)
  if (error) return res.status(400).send({ error: 'Login Error: \n' + error })
  req.login(user, _err => {
    req.session.user = user as UserApi.User
    const data: UserApi.Login.Response = { email: user.email }
    res.status(200).send({ data })
  })
})
*/
router.post('/login/google',
  passport.authenticate(
    'google',
    { scope: ['profile', 'email'] },
  ),
)

router.get('/login/google/callback',
  passport.authenticate(
    'google',
    {
      successRedirect: `${process.env.FRONTEND_URL}/`,
      failureRedirect: `${process.env.FRONTEND_URL}/`,
    },
  ),
)

router.post('/logout', auth,
  typedRequestHandler((req, res) => {
    req.logout()
    res.sendStatus(200)
  }),
)

router.get('/user/me', auth,
  typedRequestHandler<UserApi.GetMe.Response>((req, res, _next) => {
    const user = req.session.user
    if (!user) return res.sendStatus(401)
    const data = { email: user.email }
    res.status(200).send({ data })
  }),
)

export default router
