import { NextFunction, Request, Response } from 'express'
import { AnyZodObject } from 'zod'
import catchAsync from '../utils/catchAsync'

// const shenaBahini = name => {
//     return async (req: Request, res: Response, next: NextFunction) => {
//       console.log(`i am a shenabahini my name is ${name}`)
//       // next()
//     }
//   }

// const validateRequest = (schema: AnyZodObject) => {
//   return async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       await schema.parseAsync({
//         body: req.body,
//       })
//       return next()
//     } catch (err) {
//       next(err)
//     }
//   }
// }

const validateRequest = (schema: AnyZodObject) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await schema.parseAsync({
      body: req.body,
      cookies: req.cookies,
    })
    return next()
  })
}

export default validateRequest

// video part 3 end.
