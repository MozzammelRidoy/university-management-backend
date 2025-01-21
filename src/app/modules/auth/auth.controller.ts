import config from '../../config'
import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { AuthServices } from './auth.service'

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUser(req.body)
  const { refreshToken, accessToken, needPasswordChange } = result

  res.cookie('refreshToken', refreshToken, {
    secure: config.NODE_ENV === 'production',
    sameSite: 'none',
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 365,
  })

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User is logged in successfully',
    data: {
      accessToken,
      needPasswordChange,
    },
  })
})

const changePassword = catchAsync(async (req, res) => {
  const { ...passwordData } = req.body
  const result = await AuthServices.changePassword(req.user, passwordData)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Password is updated successfully',
    data: result,
  })
})

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies
  const result = await AuthServices.refreshToken(refreshToken)
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Access Token is refreshed successfully',
    data: result,
  })
})

const forgetPassword = catchAsync(async (req, res) => {
  const userId = req.body.id
  const result = await AuthServices.forgetPassword(userId)
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Reset lint Sent Successfully',
    data: result,
  })
})

const resetPassword = catchAsync(async (req, res) => {
  const result = await AuthServices.resetPassword(req.body, req.user)
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Password Reset Successful',
    data: result,
  })
})
export const AuthController = {
  loginUser,
  changePassword,
  refreshToken,
  forgetPassword,
  resetPassword,
}
