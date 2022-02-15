import express from 'express'
import expressSession from 'express-session'
import bodyParser from 'body-parser'
import passport from 'passport'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import passportGoogleOauth from 'passport-google-oauth20'

import { UserModel } from '@/schema/user'
import * as UserApi from '@api/user'

import userRouter from '@/route/user'
import videoRouter from '@/route/video'
import trackRouter from '@/route/track'
import infoRouter from '@/route/info'
import { googleOauthCallback } from '@/middleware'

dotenv.config()

const App = express()
App.use(bodyParser.json())
App.use(bodyParser.urlencoded({ extended: true }))
App.use(
  cors({
    origin: ['http://localhost:3000'],
    credentials: true,
  }),
)
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

passport.use(new passportGoogleOauth.Strategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackURL: '/login/google/callback',
    passReqToCallback: true,
  },
  googleOauthCallback,
))
passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((user, done) => done(null, user as UserApi.User))

mongoose.Schema.Types.String.checkRequired(v => v != null)
App.use(userRouter)
App.use(videoRouter)
App.use(trackRouter)
App.use(infoRouter)

App.listen(process.env.PORT)
console.log(`Express App listening on port ${process.env.PORT}`)

mongoose.connect(process.env.MONGO_DB_HOST || '', {
  user: process.env.MONGO_DB_USER,
  pass: process.env.MONGO_DB_PWD,
  authSource: 'admin',
})
console.log(`Connected to MongoDB ${process.env.MONGO_DB_HOST}`)
