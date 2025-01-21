import { academicSemesterNameAndCodeMapper } from './academic.Semester.constant'
import { AcademicSemeter } from './academic.Semester.model'
import { TAcademicSemester } from './academic.Semeter.interface'

const getAllSemesterFromDB = async () => {
  const result = await AcademicSemeter.find()
  return result
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
