import express from 'express'
import passport from 'passport'

import { UserModel } from '../schema/user'

const router = express.Router()

router.use('/register', async (req, res, _next) => {
  const { email, password } = req.body
  const user = await UserModel.findOne({ email }).exec()
  if (user) return res.status(400).send('User with this email already exists.')
  UserModel.register(new UserModel({ email, username: email }), password, (err, user) => {
    if (err) return res.status(400).send('Error on register: \n' + err)
    passport.authenticate('local')(req, res, () => res.status(200).send(user))
  })
})

export default router
