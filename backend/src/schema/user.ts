import mongoose, {
  PassportLocalModel,
  PassportLocalDocument,
  PassportLocalSchema,
} from 'mongoose'
import passportLocalMongoose from 'passport-local-mongoose'

import { schemaRequireAll } from '@/util/schema'

export interface User extends PassportLocalDocument {
  email: string
  password: string
}

const UserSchema = new mongoose.Schema({
  email: String,
  password: {
    type: String,
    required: false, // https://stackoverflow.com/questions/47757670
  },
})
schemaRequireAll(UserSchema)
UserSchema.plugin(passportLocalMongoose, {
  usernameField: 'email',
  passwordField: 'password',
})

export const UserModel: PassportLocalModel<User> = mongoose.model(
  'User',
  UserSchema as PassportLocalSchema,
)
