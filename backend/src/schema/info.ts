import { model, Model, Document, Schema } from 'mongoose'
import { ObjectId } from 'mongodb'

import { InfoStyleSchema } from '@/schema/sub-schema/style'
import { Info } from '@api/info'
import { schemaRequireAll } from '@/util/schema'

export interface InfoDoc extends Info, Document {}

const InfoSchema = new Schema({
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

export const InfoModel: Model<InfoDoc> = model('Info', InfoSchema)
