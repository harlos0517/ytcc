import mongoose from 'mongoose'
import { ObjectId } from 'mongodb'

import { StyleSchema } from './sub-schema/style'
import { schemaRequireAll } from '@/util/schema'

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
    type: StyleSchema,
    required: false,
  },
})
schemaRequireAll(InfoSchema)

export const InfoModel = mongoose.model('Info', InfoSchema)
