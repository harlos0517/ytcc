import express from 'express'
import mongoose from 'mongoose'

const app = express()

mongoose.connect('mongodb://localhost/ytcc-dev')
