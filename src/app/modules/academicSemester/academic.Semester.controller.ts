import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { AcademicSemesterService } from './academic.Semester.service'

const getAllSemester = catchAsync(async (req, res) => {
  const result = await AcademicSemesterService.getAllSemesterFromDB()
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Semesters is Retrived Succeffully!',
    data: result,
  })
})
const getSingleSemester = catchAsync(async (req, res) => {
  const { semesterId } = req.params
  const result =
    await AcademicSemesterService.getSingleSemesterFromDB(semesterId)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Semester is Successfully Loaded.',
    data: result,
  })
})
const createAcademicSemester = catchAsync(async (req, res) => {
  const result = await AcademicSemesterService.createAcademicSemesterIntoDB(
    req.body,
  )
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Academic Semester is Created Success!',
    data: result,
  })
})

const updateAcademicSemester = catchAsync(async (req, res) => {
  const { semesterId } = req.params

  const result =
    await AcademicSemesterService.updateSingleAcademicSemesterIntoDB(
      semesterId,
      req.body,
    )

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'This Semester Successfully Updated!',
    data: result,
  })
})
export const AcademicSemesterControllers = {
  createAcademicSemester,
  getAllSemester,
  getSingleSemester,
  updateAcademicSemester,
}
