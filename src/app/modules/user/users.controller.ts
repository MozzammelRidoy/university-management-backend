import { usersService } from './users.service'
import sendResponse from '../../utils/sendResponse'
import catchAsync from '../../utils/catchAsync'

const createStudent = catchAsync(async (req, res, next) => {
  const { password, student: studentData } = req.body

  const result = await usersService.createStudentIntoBD(
    req.file,
    password,
    studentData,
    next,
  )
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Student is Created Successfully',
    data: result,
  })
})

const createFaculty = catchAsync(async (req, res, next) => {
  const { password, faculty: facultyData } = req.body

  const result = await usersService.createFacultyIntoBD(
    req.file,
    password,
    facultyData,
    next,
  )
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Faculty is Created Successfully',
    data: result,
  })
})

const createAdmin = catchAsync(async (req, res, next) => {
  const { password, admin: adminData } = req.body

  const result = await usersService.createAdminIntoDB(
    req.file,
    password,
    adminData,
    next,
  )
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Admin is Created Successfully',
    data: result,
  })
})

// get me.
const getMe = catchAsync(async (req, res) => {
  const { userId, role } = req.user

  const result = await usersService.getMeFromDB(userId, role)
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User Retrived Successfully!',
    data: result,
  })
})

const changeUserStataus = catchAsync(async (req, res) => {
  const id = req.params.id

  const result = await usersService.changeUserStatus(id, req.body)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User Status Changed Successfully!',
    data: result,
  })
})
export const usersControllers = {
  createStudent,
  createFaculty,
  createAdmin,
  getMe,
  changeUserStataus,
}
