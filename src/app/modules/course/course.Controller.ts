import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { CourseServices } from './course.Service'

const createCourse = catchAsync(async (req, res) => {
  const result = await CourseServices.createCourseIntoDB(req.body)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Course is Created Successfully',
    data: result,
  })
})

const getSingleCourse = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await CourseServices.getSingleCourseFromDB(id)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Course is Retrived Successfully',
    data: result,
  })
})

const getAllCourses = catchAsync(async (req, res) => {
  const result = await CourseServices.getAllCoursesFromDB(req.query)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Course are Retrived Successfully',
    meta: result.meta,
    data: result.result,
  })
})

const updateCourse = catchAsync(async (req, res) => {
  const { id } = req.params

  const result = await CourseServices.updateCourseIntoDB(id, req.body)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Course is Updated Successfully',
    data: result,
  })
})
const deleteCourse = catchAsync(async (req, res) => {
  const { id } = req.params

  const result = await CourseServices.deleteCourseFromDB(id)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Course is Deleted successfully',
    data: result,
  })
})

const assignFacultiesWithCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params

  const { faculties } = req.body

  const result = await CourseServices.assignFacultiesWithCourseIntoDB(
    courseId,
    faculties,
  )

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Faculty Assign Success',
    data: result,
  })
})

const getFacultiesWithCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params

  const result = await CourseServices.getFacultiesWithCourseFromDB(courseId)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Faculties retrieved successfully!',
    data: result,
  })
})

const removeFacultiesFromCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params

  const { faculties } = req.body

  const result = await CourseServices.removeFacultiesFromCourseFromDB(
    courseId,
    faculties,
  )

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Faculty Remove Success',
    data: result,
  })
})

export const CoruseControllers = {
  createCourse,
  getAllCourses,
  getSingleCourse,
  updateCourse,
  deleteCourse,
  assignFacultiesWithCourse,
  getFacultiesWithCourse,
  removeFacultiesFromCourse,
}
