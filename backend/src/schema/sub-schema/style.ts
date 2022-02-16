import mongoose from 'mongoose'

import { InfoStyle as InfoStyleType } from '@api/style'

export type InfoStyle = InfoStyleType

export const InfoStyleSchema = new mongoose.Schema({
  size: Number, // px
  position: {
    horizontal: Number, // in percentage
    vertical: Number, // in percentage
  },
  align: {
    horizontal: Number, // in percentage
    vertical: Number, // in percentage
  },
  color: String, // #00000000
  backgroundColor: String, // #00000000
})
