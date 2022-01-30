import express from 'express'

import { UserModel } from '../schema/user'

const router = express.Router()

router.post('/register', async (req, res, _next) => {
  console.log(req.sessionID)
  const { email, password } = req.body
  UserModel.register(new UserModel({ email }), password, async (err, _user) => {
    if (err) return res.status(400).send({ error: 'Error on register: \n' + err })
    const { error } = await UserModel.authenticate()(email, password)
    if (error)
      return res.status(400).send({ error: 'Error on authentication: \n' + error })
    res.status(200).send({ success: true })
  })
})

router.post('/login', async (req, res, _next) => {
  const { email, password } = req.body
  const { error, user } = await UserModel.authenticate()(email, password)
  if (error) return res.status(400).send({ error: 'Error on authentication: \n' + error })
  req.login(user, _err => {
    req.session.user = user
    res.status(200).send({ success: true, data: user })
  })
})

router.get('/secret', async (req, res, _next) => {
  if (req.isAuthenticated()) res.status(200).send({ success: true, data: 'secret' })
  else res.status(400).send({ error: 'You are not authenticated' })
})

export default router
