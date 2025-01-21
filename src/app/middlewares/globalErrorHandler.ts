/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'
import config from '../config'
import { TErrorSources } from '../interface/error'
import handleZodValidationError from '../errors/handleZodValidationError'
import handleMongooseValidationError from '../errors/handleMongooseValidationError'
import handleMongooseCastError from '../errors/handeMongooseCastError'
import handleMongooseDuplicateError from '../errors/handleMongooseDuplicateError'
import AppError from '../errors/AppError'

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = 500
  let message = 'Something went wrong!'
  let errorSources: TErrorSources = [
    {
      path: '',
      message: 'Something went worng!',
    },
  ]

  if (err instanceof ZodError) {
    const simplifiedError = handleZodValidationError(err)

    statusCode = simplifiedError.statusCode

    message = simplifiedError.message

    errorSources = simplifiedError.errorSources
  } else if (err?.name === 'ValidationError') {
    const simplifiedError = handleMongooseValidationError(err)

    statusCode = simplifiedError.statusCode

    message = simplifiedError.message

    errorSources = simplifiedError.errorSources
  } else if (err?.name === 'CastError') {
    const simplifiedError = handleMongooseCastError(err)

    statusCode = simplifiedError.statusCode
    message = simplifiedError.message
    errorSources = simplifiedError.errorSources
  } else if (err?.code === 11000) {
    const simplifiedError = handleMongooseDuplicateError(err)

    statusCode = simplifiedError.statusCode
    message = simplifiedError.message
    errorSources = simplifiedError.errorSources
  } else if (err instanceof AppError) {
    statusCode = err?.statusCode
    message = err.message
    errorSources = [
      {
        path: '',
        message: err?.message,
      },
    ]
  } else if (err instanceof Error) {
    message = err.message
    errorSources = [
      {
        path: '',
        message: err?.message,
      },
    ]
  }

  return res.status(statusCode).json({
    sucess: false,
    message,
    errorSources,
    // err,
    stack: config.NODE_ENV === 'development' ? err?.stack : null,
  })
}

export default globalErrorHandler

//pattern :
/*
 success,
 message, 
 errorSources : [
 path : ' ', 
 message : ' '
 ], 
 stack

 */
