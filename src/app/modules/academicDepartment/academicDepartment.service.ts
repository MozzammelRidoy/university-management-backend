import QueryBuilder from '../../builder/QueryBuilder'
import { TAcademicDepartment } from './academicDepartment.interface'
import { AcademicDepartment } from './academicDepartment.model'

const createAcademicDepartmentIntoDB = async (payload: TAcademicDepartment) => {
  const result = await AcademicDepartment.create(payload)
  return result
}

const getAllAcademicDepartmentsFromDB = async (
  query: Record<string, unknown>,
) => {
  const departmentQuery = new QueryBuilder(
    AcademicDepartment.find().populate('academicFaculty'),
    query,
  )
    .search(['name'])
    .filter()
    .sort()
    .fields()
    .paginate()

  const result = await departmentQuery.modelQuery
  const meta = await departmentQuery.countTotal()

  return { result, meta }
}

const getSingleAcademicDepartmentFromDB = async (departmentId: string) => {
  const result =
    await AcademicDepartment.findById(departmentId).populate('academicFaculty')
  return result
}

const updateAcademicDepartmentIntoDB = async (
  departmentId: string,
  payload: Partial<TAcademicDepartment>,
) => {
  const result = await AcademicDepartment.findOneAndUpdate(
    { _id: departmentId },
    payload,
    { new: true },
  )
  return result
}

export const AcademicDepartmentService = {
  createAcademicDepartmentIntoDB,
  getAllAcademicDepartmentsFromDB,
  getSingleAcademicDepartmentFromDB,
  updateAcademicDepartmentIntoDB,
}
