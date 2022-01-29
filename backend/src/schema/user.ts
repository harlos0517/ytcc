import mongoose from 'mongoose'
import passportLocalMongoose from 'passport-local-mongoose'

const UserSchema = new mongoose.Schema({
  email: String,
  password_hash: String,
})
UserSchema.plugin(passportLocalMongoose)

export default mongoose.model('User', UserSchema)
