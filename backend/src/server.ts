import express from 'express'
import expressSession from 'express-session'
import bodyParser from 'body-parser'
import passport from 'passport'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'

import { UserModel } from './schema/user'

import userRouter from '@/route/user'

dotenv.config()

const App = express()
App.use(bodyParser.json())
App.use(bodyParser.urlencoded({ extended: true }))
App.use(
  cors({
    origin: ['http://localhost:3000'],
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

App.use(userRouter)

App.listen(process.env.PORT)
console.log(`Express App listening on port ${process.env.PORT}`)

mongoose.connect(process.env.MONGO_DB_HOST || '', {
  user: process.env.MONGO_DB_USER,
  pass: process.env.MONGO_DB_PWD,
  authSource: 'admin',
})
console.log(`Connected to MongoDB ${process.env.MONGO_DB_HOST}`)
