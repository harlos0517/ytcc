import mongoose from 'mongoose'

import { schemaRequireAll } from '@/util/schema'

const VideoSchema = new mongoose.Schema({
  type: String,
  handle: String,
  url: String,
  length: Number, // in seconds
})
schemaRequireAll(VideoSchema)

export const VideoModel =  mongoose.model('Video', VideoSchema)
