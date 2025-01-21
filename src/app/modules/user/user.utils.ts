import { TAcademicSemester } from '../academicSemester/academic.Semeter.interface'
import { User } from './users.model'

const findLastStudentId = async (currentYearCode: string) => {
  const laststudent = await User.findOne(
    {
      role: 'student',
      id: { $regex: `^${currentYearCode}` },
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({ createdAt: -1 })
    .lean()
  return laststudent?.id ? laststudent.id : undefined
}

export const generatedStudentId = async (payload: TAcademicSemester) => {
  let currentId = (0).toString()

  const currentYearCode = `${payload.year}${payload.code}`
  const laststudentId = await findLastStudentId(currentYearCode)

  const lastStudentSemesterCode = laststudentId?.substring(4, 6) //01
  const lastStudentYear = laststudentId?.substring(0, 4) // 2030
  const currentSemesterCode = payload.code
  const currentStudentYear = payload.year

  if (
    laststudentId &&
    lastStudentSemesterCode === currentSemesterCode &&
    lastStudentYear === currentStudentYear
  ) {
    currentId = laststudentId.substring(6)
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0')
  incrementId = `${payload.year}${payload.code}${incrementId}`
  return incrementId
}

// Faculty ID
export const findLastFacultyId = async () => {
  const lastFaculty = await User.findOne(
    {
      role: 'faculty',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1,
    })
    .lean()

  return lastFaculty?.id ? lastFaculty.id : undefined
}

export const generateFacultyId = async () => {
  let currentId = (0).toString()
  const lastFacultyId = await findLastFacultyId()

  if (lastFacultyId) {
    currentId = lastFacultyId.substring(2)
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0')

  incrementId = `F-${incrementId}`

  return incrementId
}

// Admin ID
export const findLastAdminId = async () => {
  const lastAdmin = await User.findOne(
    {
      role: 'admin',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1,
    })
    .lean()

  return lastAdmin?.id ? lastAdmin.id : undefined
}

export const generateAdminId = async () => {
  let currentId = (0).toString()
  const lastFacultyId = await findLastAdminId()

  if (lastFacultyId) {
    currentId = lastFacultyId.substring(2)
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0')

  incrementId = `A-${incrementId}`

  return incrementId
}
