import { model, Model, Document, Schema } from 'mongoose'
import { ObjectId } from 'mongodb'

import { InfoStyleSchema } from '@/schema/sub-schema/style'
import { Info } from '@api/info'
import { schemaRequireAll } from '@/util/schema'

export interface InfoDoc extends Info, Document {}

const InfoSchema = new Schema({
  videoId: ObjectId,
  trackId: ObjectId,
  userId: ObjectId,
  text: String,
  startTime: Number, // in seconds
  endTime: {
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
