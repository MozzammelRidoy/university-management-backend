import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { AcademicFacultyService } from './academicFaculty.service'

const createAcademicFaculty = catchAsync(async (req, res) => {
  const result = await AcademicFacultyService.createAcademicFacultyIntoDB(
    req.body,
  )

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Acadmic Faculty is Created Successfulyy',
    data: result,
  })
})

const getAllAcademicFaculties = catchAsync(async (req, res) => {
  const result = await AcademicFacultyService.getAllAcademicFacultiesFromDB()

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Academic Faculties are Retrived Successfully',
    data: result,
  })
})

const getSingleAcademicFaculty = catchAsync(async (req, res) => {
  const { facultyId } = req.params

  const result =
    await AcademicFacultyService.getSingleAcademicFacultyFromDB(facultyId)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Academic Faculty are Retrived Successfully!',
    data: result,
  })
})

const updateAcademicFaculty = catchAsync(async (req, res) => {
  const { facultyId } = req.params

  const result = await AcademicFacultyService.updateAcademicFacultyIntoDB(
    facultyId,
    req.body,
  )

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Academic Faculty is Updated Successfully.',
    data: result,
  })
})

export const AcademicFacultyController = {
  createAcademicFaculty,
  getAllAcademicFaculties,
  getSingleAcademicFaculty,
  updateAcademicFaculty,
}
