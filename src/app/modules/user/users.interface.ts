import { Model } from 'mongoose'
import { USER_ROLE } from './user.constant'

export type TUser = {
  id: string
  email: string
  password: string
  needsPasswordChange: boolean
  passwordChangedAt: Date
  role: 'superAdmin' | 'admin' | 'faculty' | 'student'
  status: 'in-progress' | 'blocked'
  isDeleted: boolean
}

// export type TNewUser = {
//   id: string
//   password: string
//   role: string
// }

export interface UserModel extends Model<TUser> {
  isUserExistsByCustomeId(id: string): Promise<TUser>
  isPasswordMached(
    plainTextPassword: string,
    hashedPasword: string,
  ): Promise<boolean>
  isJWTIssuedAtBeforePasswordChanged(
    passwordChangedTimestap: Date,
    jwtIssuedTimestamp: number,
  ): boolean
}

export type TUserRole = keyof typeof USER_ROLE
