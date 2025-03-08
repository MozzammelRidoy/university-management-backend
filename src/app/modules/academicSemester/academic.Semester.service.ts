import QueryBuilder from '../../builder/QueryBuilder'
import {
  academicSemesterNameAndCodeMapper,
  academicSemesterSearchAbleFields,
} from './academic.Semester.constant'
import { AcademicSemeter } from './academic.Semester.model'
import { TAcademicSemester } from './academic.Semeter.interface'

const getAllSemesterFromDB = async (query: Record<string, unknown>) => {
  const semesterQuery = new QueryBuilder(AcademicSemeter.find(), query)
    .search(academicSemesterSearchAbleFields)
    .filter()
    .sort()
    .fields()
    .paginate()

  const result = await semesterQuery.modelQuery
  const meata = await semesterQuery.countTotal()

  return { result, meata }
}
const getSingleSemesterFromDB = async (semesterId: string) => {
  const result = await AcademicSemeter.findById({ _id: semesterId })
  return result
}
const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
  if (academicSemesterNameAndCodeMapper[payload.name] !== payload.code) {
    throw new Error('Invalid Semester Code!')
  }
  const result = await AcademicSemeter.create(payload)
  return result
}

const updateSingleAcademicSemesterIntoDB = async (
  semesterId: string,
  payload: Partial<TAcademicSemester>,
) => {
  if (
    payload.name &&
    payload.code &&
    academicSemesterNameAndCodeMapper[payload.name] !== payload.code
  ) {
    throw new Error('Invalid Semester Code')
  }
  const result = await AcademicSemeter.findOneAndUpdate(
    { _id: semesterId },
    payload,
    {
      new: true,
    },
  )
  return result
}

export const AcademicSemesterService = {
  getAllSemesterFromDB,
  getSingleSemesterFromDB,
  createAcademicSemesterIntoDB,
  updateSingleAcademicSemesterIntoDB,
}
