import QueryBuilder from '../../builder/QueryBuilder'
import { TAcademicFaculty } from './academicFaculty.interface'
import { AcademicFaculty } from './academicFaculty.model'

const createAcademicFacultyIntoDB = async (payload: TAcademicFaculty) => {
  const result = await AcademicFaculty.create(payload)
  return result
}

const getAllAcademicFacultiesFromDB = async (
  query: Record<string, unknown>,
) => {
  const facultyQuery = new QueryBuilder(AcademicFaculty.find(), query)
    .search(['name'])
    .filter()
    .sort()
    .fields()
    .paginate()

  const result = await facultyQuery.modelQuery
  const meta = await facultyQuery.countTotal()

  return { result, meta }
}

const getSingleAcademicFacultyFromDB = async (facultyId: string) => {
  const result = await AcademicFaculty.findById(facultyId)
  return result
}

const updateAcademicFacultyIntoDB = async (
  facultyId: string,
  payload: Partial<TAcademicFaculty>,
) => {
  const result = await AcademicFaculty.findOneAndUpdate(
    { _id: facultyId },
    payload,
    { new: true },
  )
  return result
}

export const AcademicFacultyService = {
  createAcademicFacultyIntoDB,
  getAllAcademicFacultiesFromDB,
  getSingleAcademicFacultyFromDB,
  updateAcademicFacultyIntoDB,
}
