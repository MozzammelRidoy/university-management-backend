import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { AcademicDepartmentService } from './academicDepartment.service'

const createAcademicDepartment = catchAsync(async (req, res) => {
  const result = await AcademicDepartmentService.createAcademicDepartmentIntoDB(
    req.body,
  )

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Acadmic Department is Created Successfulyy',
    data: result,
  })
})

const getAllAcademicDepartments = catchAsync(async (req, res) => {
  const result =
    await AcademicDepartmentService.getAllAcademicDepartmentsFromDB(req.query)

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Academic Departments are Retrived Successfully',
    data: result.result,
    meta: result.meta,
  })
})

const getSingleAcademicDepartment = catchAsync(async (req, res) => {
  const { departmentId } = req.params

  const result =
    await AcademicDepartmentService.getSingleAcademicDepartmentFromDB(
      departmentId,
    )

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Academic Department are Retrived Successfully!',
    data: result,
  })
})

const updateAcademicDepartment = catchAsync(async (req, res) => {
  const { departmentId } = req.params

  const result = await AcademicDepartmentService.updateAcademicDepartmentIntoDB(
    departmentId,
    req.body,
  )

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Academic Department is Updated Successfully.',
    data: result,
  })
})

export const AcademicDepartmentController = {
  getAllAcademicDepartments,
  getSingleAcademicDepartment,
  createAcademicDepartment,
  updateAcademicDepartment,
}
