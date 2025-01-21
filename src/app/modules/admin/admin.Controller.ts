import catchAsync from '../../utils/catchAsync'
import sendResponse from '../../utils/sendResponse'
import { AdminService } from './admin.Service'

const getSingleAdmin = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await AdminService.getSingleAdminFromDB(id)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Admin is retrieved succesfully',
    data: result,
  })
})

const getAllAdmins = catchAsync(async (req, res) => {
  const result = await AdminService.getAllAdminsFromDB(req.query)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Admins are retrieved succesfully',
    meta: result.meta,
    data: result.result,
  })
})

const updateAdmin = catchAsync(async (req, res) => {
  const { id } = req.params
  const { admin } = req.body
  const result = await AdminService.updateAdminIntoDB(id, admin)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Admin is updated succesfully',
    data: result,
  })
})

const deleteAdmin = catchAsync(async (req, res) => {
  const { id } = req.params
  const result = await AdminService.deleteAdminFromDB(id)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Admin is deleted succesfully',
    data: result,
  })
})

export const AdminControllers = {
  getSingleAdmin,
  getAllAdmins,
  updateAdmin,
  deleteAdmin,
}
