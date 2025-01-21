import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { OfferedCourseServices } from './offeredCourses.service'

const createOfferedCourse = catchAsync(async (req, res) => {
  const result = await OfferedCourseServices.createOfferedCourseIntoDB(req.body)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Offered Course is Created successfully',
    data: result,
  })
})

const getAllOfferedCourses = catchAsync(async (req, res) => {
  const result = await OfferedCourseServices.getAllOfferedCoursesFromDB(
    req.query,
  )
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Offered Courses are retrieved successfully',
    data: result,
  })
})

const getMyOfferedCourses = catchAsync(async (req, res) => {
  const userId = req.user.userId
  const result = await OfferedCourseServices.getMyOfferedCoursesFromDB(
    userId,
    req.query,
  )
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Offered Courses are retrieved successfully',
    meta: result.meta,
    data: result.result,
  })
})

const getSingleOfferedCourse = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await OfferedCourseServices.getSingleOfferedCourseFromDB(id)
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Offered Course is retrieved successfully',
    data: result,
  })
})

const updateOfferedCourse = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await OfferedCourseServices.updateOfferedCourseIntoDB(
    id,
    req.body,
  )
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Offered Course is updated successfully',
    data: result,
  })
})

export const OfferedCourseControllers = {
  createOfferedCourse,
  getAllOfferedCourses,
  getMyOfferedCourses,
  getSingleOfferedCourse,
  updateOfferedCourse,
}
