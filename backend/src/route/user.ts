import express, { RequestHandler } from 'express'

import { UserModel } from '../schema/user'

const router = express.Router()

// auth middleware
export const auth: RequestHandler = async (req, res, next) => {
  if (req.isAuthenticated()) next()
  else res.status(400).send({ error: 'Not Authenticated' })  
}

router.post('/register', async (req, res, _next) => {
  const { email, password } = req.body
  UserModel.register(new UserModel({ email }), password, async (err, _user) => {
    if (err) res.status(400).send({ error: 'Register Error: \n' + err })
    else res.sendStatus(200)
  })
})

router.post('/login', async (req, res, _next) => {
  const { email, password } = req.body
  const { error, user } = await UserModel.authenticate()(email, password)
  if (error) return res.status(400).send({ error: 'Login Error: \n' + error })
  req.login(user, _err => {
    req.session.user = user
    res.status(200).send({ data: user })
  })
})

router.post('/logout', auth, async (req, res, _next) => {
  req.logout()
  res.sendStatus(200)
})

router.get('/secret', auth, async (req, res, _next) => {
  res.status(200).send({ data: 'YTCC' })
})

router.get('/user/me', auth, async (req, res, _next) => {
  res.status(200).send({ data: req.session.user })
})

export default router
