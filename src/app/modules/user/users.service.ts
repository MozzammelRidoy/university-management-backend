/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose'
import config from '../../config'
import { AcademicSemeter } from '../academicSemester/academic.Semester.model'
import {
  generateAdminId,
  generatedStudentId,
  generateFacultyId,
} from './user.utils'
import AppError from '../../errors/AppError'
import { NextFunction } from 'express'
import { TFaculty } from '../faculty/faculty.Interface'
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model'
import { Faculty } from '../faculty/faculty.Model'
import { TStudent } from '../student/students.interface'
import { Student } from '../student/students.model'
import { TUser } from './users.interface'
import { User } from './users.model'
import { Admin } from '../admin/admin.Model'
import { sendImageToCloudinay } from '../../utils/sendImageToCloudinary'

const createStudentIntoBD = async (
  file: any,
  password: string,
  payload: TStudent,
  next: NextFunction,
) => {
  //create a user object
  //   const user: TNewUser = {}
  const userData: Partial<TUser> = {}

  //if password is not given, use default password.
  userData.password = password || (config.default_password as string)

  //set user role.
  userData.role = 'student'

  // set user email
  userData.email = payload.email

  const addmissionSemester = await AcademicSemeter.findById(
    payload.addmissionSemester,
  )
  if (!addmissionSemester) {
    throw new Error('Semester Not Found!')
  }

  //find department
  const academiDepartment = await AcademicDepartment.findById(
    payload.academicDepartment,
  )
  if (!academiDepartment) {
    throw new AppError(404, 'Academic Department not found')
  }

  payload.academicFaculty = academiDepartment.academicFaculty

  //set manually generated id

  const session = await mongoose.startSession() // session create
  try {
    session.startTransaction() //transaction start

    userData.id = await generatedStudentId(addmissionSemester)

    if (file) {
      // call cloudinary .
      const imageName = `${userData?.id}_${payload?.name?.firstName}`
      const path = file?.path
      const { secure_url } = await sendImageToCloudinay(imageName, path)
      payload.profileImage = secure_url as string
    }

    const newUser = await User.create([userData], { session }) // user create & (Transaction-1)

    if (!newUser.length) {
      throw new AppError(400, 'Failed to Create User') //  ensuring User Created
    }

    payload.id = newUser[0].id // set id in Student Data
    payload.user = newUser[0]._id // set user Reference in Student

    const newStudent = await Student.create([payload], { session }) // student create & (Transaction-2)

    if (!newStudent.length) {
      throw new AppError(400, 'Failed to Create Student') // ensuring student Created
    }

    await session.commitTransaction()
    await session.endSession()

    return newStudent
  } catch (err) {
    await session.abortTransaction()
    await session.endSession()
    next(err)
    throw new AppError(400, 'Failed to Create Student')
  }
}

// faculty Create ====================

const createFacultyIntoBD = async (
  file: any,
  password: string,
  payload: TFaculty,
  next: NextFunction,
) => {
  const userData: Partial<TUser> = {}
  //if password is not given, use default password.
  userData.password = password || (config.default_password as string)
  //set faculty role.
  userData.role = 'faculty'

  // set faculty email.
  userData.email = payload.email

  //find academic Department
  const academicDepartment = await AcademicDepartment.findById(
    payload.academicDepartment,
  )

  if (!academicDepartment) {
    throw new AppError(404, 'Academic Department Not Found')
  }

  //set academic faculty
  payload.academicFaculty = academicDepartment?.academicFaculty

  const session = await mongoose.startSession() // session created

  try {
    session.startTransaction() // session started

    userData.id = await generateFacultyId()

    if (file) {
      // call cloudinary .
      const imageName = `${userData?.id}_${payload?.name?.firstName}`
      const path = file?.path
      const { secure_url } = await sendImageToCloudinay(imageName, path)
      payload.profileImage = secure_url as string
    }

    // user crearte (transaction-1)
    const newUser = await User.create([userData], { session })

    if (!newUser.length) {
      throw new AppError(400, 'Failed to Create Users')
    }

    payload.id = newUser[0].id
    payload.user = newUser[0]._id

    // create faculty (transaction-2)

    const newFaculty = await Faculty.create([payload], { session })

    if (!newFaculty.length) {
      throw new AppError(400, 'Faield to Create Faculty')
    }

    await session.commitTransaction()
    await session.endSession()
    return newFaculty
  } catch (err) {
    await session.abortTransaction()
    await session.endSession()
    next(err)
    throw new AppError(400, 'Failed to Create Faculty')
  }
}

// admin Create ==================
const createAdminIntoDB = async (
  file: any,
  password: string,
  payload: TFaculty,
  next: NextFunction,
) => {
  // create a user object
  const userData: Partial<TUser> = {}

  //if password is not given , use deafult password
  userData.password = password || (config.default_password as string)

  //set student role
  userData.role = 'admin'
  //set admin email
  userData.email = payload.email

  const session = await mongoose.startSession() // session create.

  try {
    session.startTransaction()
    userData.id = await generateAdminId()

    if (file) {
      // call cloudinary .
      const imageName = `${userData?.id}_${payload?.name?.firstName}`
      const path = file?.path
      const { secure_url } = await sendImageToCloudinay(imageName, path)
      payload.profileImage = secure_url as string
    }

    // create a user (transaction-1)
    const newUser = await User.create([userData], { session })

    //create a admin
    if (!newUser.length) {
      throw new AppError(400, 'Failed to create admin')
    }

    // set id , _id as user
    payload.id = newUser[0].id
    payload.user = newUser[0]._id //reference _id

    // create a admin (transaction-2)
    const newAdmin = await Admin.create([payload], { session })

    if (!newAdmin.length) {
      throw new AppError(400, 'Failed to create admin')
    }

    await session.commitTransaction()
    await session.endSession()

    return newAdmin
  } catch (err) {
    await session.abortTransaction()
    await session.endSession()
    next(err)
    throw new AppError(400, 'Failed to create admin!')
  }
}

// getMe
const getMeFromDB = async (id: string, role: string) => {
  let result = null
  if (role === 'student') {
    result = await Student.findOne({ id })
      .populate('user')
      .populate('addmissionSemester')
      .populate({
        path: 'academicDepartment',
        populate: { path: 'academicFaculty' },
      })
  } else if (role === 'admin') {
    result = await Admin.findOne({ id }).populate('user')
  } else if (role === 'faculty') {
    result = await Faculty.findOne({ id }).populate(
      'user academicDepartment academicFaculty',
    )
  }

  return result
}

const changeUserStatus = async (id: string, payload: { status: string }) => {
  const result = await User.findByIdAndUpdate(id, payload, { new: true })
  return result
}
export const usersService = {
  createStudentIntoBD,
  createFacultyIntoBD,
  createAdminIntoDB,
  getMeFromDB,
  changeUserStatus,
}
