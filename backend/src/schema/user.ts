import mongoose, {
  PassportLocalModel,
  PassportLocalDocument,
  PassportLocalSchema,
} from 'mongoose'
import passportLocalMongoose from 'passport-local-mongoose'

import { User } from '@api/user'
import { schemaRequireAll } from '@/util/schema'

export interface UserDoc extends User, PassportLocalDocument {}

const UserSchema = new mongoose.Schema({
  google_id: {
    type: String,
    required: false,
  },
})
schemaRequireAll(UserSchema)
UserSchema.plugin(passportLocalMongoose, {
  usernameField: 'email',
})

export const UserModel: PassportLocalModel<UserDoc> = mongoose.model(
  'User',
  UserSchema as PassportLocalSchema,
)
