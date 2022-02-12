import mongoose, { Model, Document } from 'mongoose'
import { ObjectId } from 'mongodb'

import { InfoStyleSchema } from '@/schema/sub-schema/style'
import { Track } from '@api/track'
import { schemaRequireAll } from '@/util/schema'

export interface TrackDoc extends Track, Document {}

const TrackSchema = new mongoose.Schema({
  video_id: ObjectId,
  user_id: ObjectId,
  type: String,
  default_style: {
    type: InfoStyleSchema,
    required: false,
  },
})
schemaRequireAll(TrackSchema)
export const TrackModel: Model<TrackDoc> = mongoose.model('Track', TrackSchema)
