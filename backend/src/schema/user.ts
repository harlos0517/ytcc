import mongoose, {
  PassportLocalModel,
  PassportLocalDocument,
  PassportLocalSchema,
} from 'mongoose'
import passportLocalMongoose from 'passport-local-mongoose'

import { schemaRequireAll } from '@/util/schema'

export interface User extends PassportLocalDocument {
  email: string
}

const UserSchema = new mongoose.Schema({
})
schemaRequireAll(UserSchema)
UserSchema.plugin(passportLocalMongoose, {
  usernameField: 'email',
})

export const UserModel: PassportLocalModel<User> = mongoose.model(
  'User',
  UserSchema as PassportLocalSchema,
)
