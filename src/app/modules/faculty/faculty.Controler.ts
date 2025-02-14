import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { FacultyServices } from './faculty.Service'

const getSingleFaculty = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await FacultyServices.getSingleFacultyFromDB(id)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Faculty is retrieved succesfully',
    data: result,
  })
})

const getAllFaculties = catchAsync(async (req, res) => {
  const result = await FacultyServices.getAllFacultiesFromDB(req.query)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Faculties is retrieved succesfully',
    meta: result.meta,
    data: result.result,
  })
})

const updateFaculty = catchAsync(async (req, res) => {
  const { id } = req.params
  const { faculty } = req.body
  const result = await FacultyServices.updateFacultyIntoDB(id, faculty)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Faculty is updated succesfully',
    data: result,
  })
})

const deleteFaculty = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await FacultyServices.deleteFacultyFromDB(id)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Faculty is deleted succesfully',
    data: result,
  })
})
export const FacultyController = {
  getSingleFaculty,
  getAllFaculties,
  updateFaculty,
  deleteFaculty,
}
