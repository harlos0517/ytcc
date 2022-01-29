import mongoose from 'mongoose'
import { ObjectId } from 'mongodb'

import { InfoStyle, InfoStyleSchema } from './sub-schema/style'
import { schemaRequireAll } from '@/util/schema'

export type Info = {
  video_id: string
  track_id: string
  user_id: string
  text: string
  start_time: number // in seconds
  end_time?: number // in seconds
  style?: InfoStyle
}

const InfoSchema = new mongoose.Schema({
  video_id: ObjectId,
  track_id: ObjectId,
  user_id: ObjectId,
  text: String,
  start_time: Number, // in seconds
  end_time: {
    type: Number, // in seconds
    required: false,
  },
  style: {
    type: InfoStyleSchema,
    required: false,
  },
})
schemaRequireAll(InfoSchema)

export const InfoModel = mongoose.model('Info', InfoSchema)
