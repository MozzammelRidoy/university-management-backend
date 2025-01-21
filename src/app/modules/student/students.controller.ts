import { StudentService } from './students.service'
import sendResponse from '../../utils/sendResponse'
import catchAsync from '../../utils/catchAsync'

const getAllStudent = catchAsync(async (req, res) => {
  const result = await StudentService.getAllStudentsFromDB(req.query)
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Students are retrived succefully',
    meta: result.meta,
    data: result.result,
  })
})

const getSingleStudent = catchAsync(async (req, res) => {
  const { id } = req.params

  const result = await StudentService.getSingleStudentFromDB(id)
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Student is retrived successfully',
    data: result,
  })
})

const updateStudent = catchAsync(async (req, res) => {
  const { id } = req.params
  const { student } = req.body
  const result = await StudentService.updateSingleStudentFromDB(id, student)
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Student Update successfully',
    data: result,
  })
})

const deleteSingleStudent = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await StudentService.deleteStudentFromDB(id)
  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Student Deleted Success',
    data: result,
  })
})
export const studentControllers = {
  getAllStudent,
  getSingleStudent,
  updateStudent,
  deleteSingleStudent,
}
