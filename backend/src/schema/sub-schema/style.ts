import mongoose from 'mongoose'

export type InfoStyle = {
  size: number // px
  position: {
    horizontal: number // in percentage
    vertical: number // in percentage
  }
  align: {
    horizontal: number // in percentage
    vertical: number // in percentage
  }
  color: string // #00000000
  background_color: string // #00000000
}

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
  background_color: String, // #00000000
})
