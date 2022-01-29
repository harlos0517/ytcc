import mongoose from 'mongoose'

export const StyleSchema = new mongoose.Schema({
  size: Number, // px
  position: {
    horizontal: Number, // in percentage
    vertical: Number, // in percentage
  },
  align:{
    horizontal: Number, // in percentage
    vertical: Number, // in percentage
  },
  color: String, // #00000000
  background_color: String, // #00000000
})
