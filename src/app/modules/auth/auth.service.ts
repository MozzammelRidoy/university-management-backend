/* eslint-disable @typescript-eslint/no-explicit-any */
import config from '../../config'
import AppError from '../../errors/AppError'
import { User } from '../user/users.model'
import { TLoginUser } from './auth.interface'
import jwt, { JwtPayload } from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { createToken } from './auth.utils'
import { sendEmail } from '../../utils/sendEmail'

const loginUser = async (payload: TLoginUser) => {
  //checking if the user is exist in the database
  const user = await User.isUserExistsByCustomeId(payload?.id)
  if (!user) {
    throw new AppError(404, 'This user is not found!')
  }

  // checking if the user is alrady deleted.
  const isDeleted = user?.isDeleted
  if (isDeleted) {
    throw new AppError(403, 'This user is deleted!')
  }

  // checking if the user is blocked
  const userStatus = user?.status
  if (userStatus === 'blocked') {
    throw new AppError(403, 'This user is blocked!')
  }

  // checking  if the password is correct
  //   const isPasswordMatched = await bcrypt.compare(
  //     payload?.password,
  //     isUserExist?.password,
  //   )
  if (!(await User.isPasswordMached(payload?.password, user?.password))) {
    throw new AppError(403, 'Password do not matched!')
  }

  // create token and sent to the client

  const jwtPayload = {
    userId: user.id,
    role: user.role,
  }
  // const accessToken = jwt.sign(
  //   jwtPayload,
  //   config.jwt_access_token_secret as string,
  //   { expiresIn: '10d' },
  // )
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_token_secret as string,
    config.jwt_access_token_expiry as string,
  )

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_token_secret as string,
    config.jwt_refresh_token_expiry as string,
  )

  return {
    accessToken,
    refreshToken,
    needPasswordChange: user?.needsPasswordChange,
  }
}

const changePassword = async (
  userData: JwtPayload,
  payload: { oldPassword: string; newPassword: string },
) => {
  //checking if the user is exist in the database
  const user = await User.isUserExistsByCustomeId(userData.userId)
  if (!user) {
    throw new AppError(404, 'This user is not found!')
  }

  // checking if the user is alrady deleted.
  const isDeleted = user?.isDeleted
  if (isDeleted) {
    throw new AppError(403, 'This user is deleted!')
  }

  // checking if the user is blocked
  const userStatus = user?.status
  if (userStatus === 'blocked') {
    throw new AppError(403, 'This user is blocked!')
  }

  if (!(await User.isPasswordMached(payload?.oldPassword, user?.password))) {
    throw new AppError(403, 'Password do not matched!')
  }

  // hashed new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  )

  await User.findOneAndUpdate(
    {
      id: userData.userId,
      role: userData.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  )

  return null
}

const refreshToken = async (token: string) => {
  // if the token is sent from the client.
  if (!token) {
    throw new AppError(401, 'You are not authorized.')
  }

  // check if the token is valid.
  let decoded: JwtPayload
  try {
    decoded = jwt.verify(
      token,
      config.jwt_refresh_token_secret as string,
    ) as JwtPayload
  } catch (err: any) {
    throw new AppError(401, err.message)
  }

  const { userId, iat } = decoded

  //checking if the user is exist in the database
  const user = await User.isUserExistsByCustomeId(userId)
  if (!user) {
    throw new AppError(404, 'This user is not found!')
  }

  // checking if the user is alrady deleted.
  const isDeleted = user?.isDeleted
  if (isDeleted) {
    throw new AppError(403, 'This user is deleted!')
  }

  // checking if the user is blocked
  const userStatus = user?.status
  if (userStatus === 'blocked') {
    throw new AppError(403, 'This user is blocked!')
  }

  if (
    user.passwordChangedAt &&
    User.isJWTIssuedAtBeforePasswordChanged(
      user.passwordChangedAt,
      iat as number,
    )
  ) {
    throw new AppError(401, 'You are not authorized.')
  }

  const jwtPayload = {
    userId: user.id,
    role: user.role,
  }
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_token_secret as string,
    config.jwt_access_token_expiry as string,
  )

  return {
    accessToken,
  }
}

// forget password
const forgetPassword = async (userId: string) => {
  //checking if the user is exist in the database
  const user = await User.isUserExistsByCustomeId(userId)
  if (!user) {
    throw new AppError(404, 'This user is not found!')
  }

  // checking if the user is alrady deleted.
  const isDeleted = user?.isDeleted
  if (isDeleted) {
    throw new AppError(403, 'This user is deleted!')
  }

  // checking if the user is blocked
  const userStatus = user?.status
  if (userStatus === 'blocked') {
    throw new AppError(403, 'This user is blocked!')
  }

  const jwtPayload = {
    userId: user.id,
    role: user.role,
  }
  const resetToken = createToken(
    jwtPayload,
    config.jwt_access_token_secret as string,
    '10m',
  )

  const resetUILink = `${config.reset_pass_ui_link}?id=${user.id}&token=${resetToken}`

  sendEmail(user.email, resetUILink)
}
//reset password.
const resetPassword = async (
  payload: { id: string; newPassword: string },
  userData: JwtPayload,
) => {
  if (userData.userId !== payload.id) {
    throw new AppError(403, 'You are not Authorized')
  }

  // hashed new password
  const newHashedPassword = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds),
  )

  await User.findOneAndUpdate(
    {
      id: userData.userId,
      role: userData.role,
    },
    {
      password: newHashedPassword,
      needsPasswordChange: false,
      passwordChangedAt: new Date(),
    },
  )
}
export const AuthServices = {
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
}
