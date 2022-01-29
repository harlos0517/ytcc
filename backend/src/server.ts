import express from 'express'
import expressSession from 'express-session'
import bodyParser from 'body-parser'
import passport from 'passport'
import mongoose from 'mongoose'

import { UserModel } from './schema/user'

import userRouter from '@/route/user'

const PORT = 1233
const MONGO_DB = 'mongodb://localhost/ytcc-dev'

const App = express()
App.use(bodyParser.urlencoded({ extended: true }))
App.use(
  expressSession({
    secret: 'ytcc',
    resave: false,
    saveUninitialized: false,
  }),
)
App.use(passport.initialize())
App.use(passport.session())
passport.use(UserModel.createStrategy())
passport.serializeUser(UserModel.serializeUser())
passport.deserializeUser(UserModel.deserializeUser())

App.use(userRouter)

App.listen(PORT)
console.log(`Express App listening on port ${PORT}`)

mongoose.connect(MONGO_DB, {
  user: '',
  pass: '',
  authSource: 'admin',
})
console.log(`Connected to MongoDB ${MONGO_DB}`)
