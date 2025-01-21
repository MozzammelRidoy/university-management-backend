import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { EnrolledCourseServices } from './enrolledCourse.service'

const createEnrollCourse = catchAsync(async (req, res) => {
  const userId = req.user.userId
  const result = await EnrolledCourseServices.createEnrolledCourseIntoDB(
    userId,
    req.body,
  )
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Student in enrolled Successfully!',
    data: result,
  })
})

const getMyEnrolledCourses = catchAsync(async (req, res) => {
  const studentId = req.user.userId

  const result = await EnrolledCourseServices.getMyEnrolledCoursesFromDB(
    studentId,
    req.query,
  )

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'My All Courese are retrieved successfully!',
    meta: result.meta,
    data: result.result,
  })
})

const updateEnrolledCourseMarks = catchAsync(async (req, res) => {
  const facultyId = req.user.userId
  const result = await EnrolledCourseServices.updateEnrolledCourseMarksIntoDB(
    facultyId,
    req.body,
  )
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Course Marks is update successfully!',
    data: result,
  })
})
export const EnrolledCourseControllers = {
  createEnrollCourse,
  getMyEnrolledCourses,
  updateEnrolledCourseMarks,
}
