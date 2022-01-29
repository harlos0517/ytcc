import mongoose, { Model, Document } from 'mongoose'

import { schemaRequireAll } from '@/util/schema'

export interface Video extends Document {
  type: string
  handle: string
  url: string
  length: number // in seconds
}

const VideoSchema = new mongoose.Schema({
  type: String,
  handle: String,
  url: String,
  length: Number, // in seconds
})
schemaRequireAll(VideoSchema)
export const VideoModel: Model<Video> = mongoose.model('Video', VideoSchema)
