import mongoose from 'mongoose'
import passportLocalMongoose from 'passport-local-mongoose'
import { schemaRequireAll } from '@/util/schema'

export type User = {
  email: string
  password_hash: string
}

const UserSchema = new mongoose.Schema({
  email: String,
  password_hash: String,
})
schemaRequireAll(UserSchema)
UserSchema.plugin(passportLocalMongoose)

export const UserModel = mongoose.model('User', UserSchema)
