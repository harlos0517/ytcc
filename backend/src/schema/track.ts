import mongoose from 'mongoose'
import { ObjectId } from 'mongodb'

import { StyleSchema } from './sub-schema/style'
import { schemaRequireAll } from '@/util/schema'

const TrackSchema = new mongoose.Schema({
  video_id: ObjectId,
  video_type: String,
  default_style: {
    type: StyleSchema,
    required: false,
  },
})
schemaRequireAll(TrackSchema)

export const TrackModel = mongoose.model('Track', TrackSchema)
