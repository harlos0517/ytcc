import mongoose, { Model, Document } from 'mongoose'
import { ObjectId } from 'mongodb'

import { InfoStyle, InfoStyleSchema } from './sub-schema/style'
import { schemaRequireAll } from '@/util/schema'

export interface Track extends Document {
  video_id: string
  type: string
  default_style?: InfoStyle
}

const TrackSchema = new mongoose.Schema({
  video_id: ObjectId,
  type: String,
  default_style: {
    type: InfoStyleSchema,
    required: false,
  },
})
schemaRequireAll(TrackSchema)
export const TrackModel: Model<Track> = mongoose.model('Track', TrackSchema)
