import mongoose from 'mongoose'
import { ObjectId } from 'mongodb'

import { InfoStyle, InfoStyleSchema } from './sub-schema/style'
import { schemaRequireAll } from '@/util/schema'

export type Track = {
  video_id: string,
  video_type: string,
  default_style?: InfoStyle
}

const TrackSchema = new mongoose.Schema({
  video_id: ObjectId,
  video_type: String,
  default_style: {
    type: InfoStyleSchema,
    required: false,
  },
})
schemaRequireAll(TrackSchema)
export const TrackModel = mongoose.model('Track', TrackSchema)
