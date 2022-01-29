import express from 'express'
import expressSession from 'express-session'
import passport from 'passport'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'

const PORT = 1233

const App = express()
App.use(bodyParser.urlencoded({ extended: true }))
App.use(passport.initialize())
App.use(passport.session())
App.use(
  expressSession({
    secret: 'ytcc',
    resave: false,
    saveUninitialized: false,
  }),
)

App.listen(PORT)
console.log(`Express App listening on port ${PORT}`)

mongoose.connect('mongodb://localhost/ytcc-dev')
console.log('Connected to MongoDB')
