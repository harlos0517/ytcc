import mongoose, { Model, Document } from 'mongoose'

import { Video } from '@api/video'
import { schemaRequireAll } from '@/util/schema'

export interface VideoDoc extends Video, Document {}

const VideoSchema = new mongoose.Schema({
  type: String,
  handle: String,
  url: String,
  length: Number, // in seconds
})
schemaRequireAll(VideoSchema)
export const VideoModel: Model<VideoDoc> = mongoose.model('Video', VideoSchema)
