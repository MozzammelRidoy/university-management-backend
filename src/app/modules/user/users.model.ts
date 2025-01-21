import { model, Schema } from 'mongoose'
import { TUser, UserModel } from './users.interface'
import config from '../../config'
import bcrypt from 'bcrypt'
import { UserStatus } from './user.constant'

const userSchema = new Schema<TUser, UserModel>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Email is required'],
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    passwordChangedAt: {
      type: Date,
    },
    needsPasswordChange: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: ['superAdmin', 'admin', 'faculty', 'student'],
    },
    status: {
      type: String,
      enum: UserStatus,
      default: 'in-progress',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

// pre save middleware / hooks.
userSchema.pre('save', async function (next) {
  // console.log(this, 'Pre Hook: We will Save data')

  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds),
  )
  next()
})

// post save middleware / hooks
userSchema.post('save', function (doc, next) {
  // console.log(this, 'Post Hook: We Saved Our Data')
  doc.password = ' '
  next()
})

userSchema.statics.isUserExistsByCustomeId = async function (id: string) {
  return await User.findOne({ id }).select('+password')
}

userSchema.statics.isPasswordMached = async function (
  plainTextPassword: string,
  hashedPasword: string,
) {
  return await bcrypt.compare(plainTextPassword, hashedPasword)
}

userSchema.statics.isJWTIssuedAtBeforePasswordChanged = function (
  passwordChangedTimestap: Date,
  jwtIssuedTimestamp: number,
) {
  const passwordChangedTime = new Date(passwordChangedTimestap).getTime() / 1000
  const passwordChangedTimeInt = parseInt(passwordChangedTime.toString())
  return passwordChangedTimeInt > jwtIssuedTimestamp
}

export const User = model<TUser, UserModel>('User', userSchema)
