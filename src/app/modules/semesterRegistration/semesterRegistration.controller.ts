import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { SemesterRegistrationServices } from './semesterRegistration.service'

const createSemesterRegistration = catchAsync(async (req, res) => {
  const result =
    await SemesterRegistrationServices.createSemesterRegistrationIntoDB(
      req.body,
    )

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Semester Registration is Created Successfully',
    data: result,
  })
})

const getAllSemesterRegistrations = catchAsync(async (req, res) => {
  const result =
    await SemesterRegistrationServices.getAllSemesterRegistrationsFromDB(
      req.query,
    )
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Semester Registration are Retrieved Successfully',
    meta: result.meta,
    data: result.result,
  })
})

const getSingleSemesterRegistration = catchAsync(async (req, res) => {
  const { id } = req.params

  const result =
    await SemesterRegistrationServices.getSingleSemesterRegistrationFromDB(id)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Semester Registration is Retrived Successfully',
    data: result,
  })
})

const updateSemesterRegistration = catchAsync(async (req, res) => {
  const { id } = req.params

  const result =
    await SemesterRegistrationServices.updateSemesterRegistrationIntoDB(
      id,
      req.body,
    )

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Semester Registration is Update Success',
    data: result,
  })
})

const deleteSemesterRegistration = catchAsync(async (req, res) => {
  const { id } = req.params

  const result =
    await SemesterRegistrationServices.deleteSemesterRegistrationIntoDB(id)
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Semester Registration is Deleted Success',
    data: result,
  })
})
export const SemesterRagistrationControllers = {
  createSemesterRegistration,
  getAllSemesterRegistrations,
  getSingleSemesterRegistration,
  updateSemesterRegistration,
  deleteSemesterRegistration,
}
