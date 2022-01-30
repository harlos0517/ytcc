import express from 'express'
import passport from 'passport'

import { UserModel } from '../schema/user'

const router = express.Router()

router.post('/register', async (req, res, _next) => {
  const { email, password } = req.body
  UserModel.register(new UserModel({ email }), password, async (err, _user) => {
    if (err)
      return res.status(400).send({
        error: 'Error on register: \n' + err,
      })
    const { error } = await UserModel.authenticate()(email, password)
    if (error)
      return res.status(400).send({
        error: 'Error on authentication: \n' + error,
      })
    res.status(200).send({ success: true })
  })
})

router.post('/login', async (req, res, _next) => {
  const { email, password } = req.body
  const { error } = await UserModel.authenticate()(email, password)
  if (error)
    return res.status(400).send({
      error: 'Error on authentication: \n' + error,
    })
  passport.authenticate('local')(req, res, () =>
    res.status(200).send({ success: true }),
  )
})

export default router
