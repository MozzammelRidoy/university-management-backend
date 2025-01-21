import { NextFunction, Request, Response } from 'express'
import catchAsync from '../utils/catchAsync'
import AppError from '../errors/AppError'
import jwt, { JwtPayload } from 'jsonwebtoken'
import config from '../config'
import { TUserRole } from '../modules/user/users.interface'
import { User } from '../modules/user/users.model'

//Bangla system. not best practice.
// interface CustomRequest extends Request {
//   user: JwtPayload
// }

const auth = (...requiredRole: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization

    // if the token is sent from the client.
    if (!token) {
      throw new AppError(401, 'You are not authorized.')
    }

    // check if the token is valid.
    // jwt.verify(
    //   token,
    //   config.jwt_access_token_secret as string,
    //   (err, decoded) => {
    //     if (err) {
    //       throw new AppError(401, 'You are not authorized.')
    //     }

    //     const role = (decoded as JwtPayload).role

    //     if (requiredRole && !requiredRole.includes(role)) {
    //       throw new AppError(401, 'You are not authorized.')
    //     }

    //     // set the user to the request object.
    //     req.user = decoded as JwtPayload
    //     next()
    //   },
    // )

    const decoded = jwt.verify(
      token,
      config.jwt_access_token_secret as string,
    ) as JwtPayload

    const { userId, role, iat } = decoded

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

    if (requiredRole && !requiredRole.includes(role)) {
      throw new AppError(401, 'You are not authorized.')
    }

    // set the user to the request object.
    req.user = decoded as JwtPayload
    next()
  })
}

export default auth
