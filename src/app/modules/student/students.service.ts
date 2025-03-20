import mongoose from 'mongoose'
import { Student } from './students.model'
import AppError from '../../errors/AppError'
import { TStudent } from './students.interface'
import QueryBuilder from '../../builder/QueryBuilder'
import { studentSearchableFileds } from './students.constant'
import { User } from '../user/users.model'
import { sendImageToCloudinay } from '../../utils/sendImageToCloudinary'

const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
  const studentQuery = new QueryBuilder(
    Student.find()
      .populate('user')
      .populate('addmissionSemester')
      .populate({
        path: 'academicDepartment',
        populate: { path: 'academicFaculty' },
      }),
    query,
  )
    .search(studentSearchableFileds)
    .filter()
    .sort()
    .paginate()
    .fields()

  const meta = await studentQuery.countTotal()
  const result = await studentQuery.modelQuery

  return { meta, result }
}

const getSingleStudentFromDB = async (id: string) => {
  const result = await Student.findById(id).populate(
    'user addmissionSemester academicDepartment academicFaculty',
  )

  return result
}

const updateSingleStudentIntoDB = async (
  id: string,
  file: any,
  payload: Partial<TStudent>,
) => {
  const { name, guardian, localGuardian, ...remainingStudentData } = payload

  const modifiedUpdateData: Record<string, unknown> = {
    ...remainingStudentData,
  }

  /* 
      {
        "name" : {
            "lastName" : "set"
        },
        "guardian.fatherOccupation" : "Teacher"
      }

      -> name.firstName = 'Abc'
      -> name.lastName = 'Xyz'
  */

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdateData[`name.${key}`] = value
    }
  }

  if (guardian && Object.keys(guardian).length) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedUpdateData[`guardian.${key}`] = value
    }
  }

  if (localGuardian && Object.keys(localGuardian).length) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedUpdateData[`localGuardian.${key}`] = value
    }
  }
  if (file) {
    // call cloudinary .
    const imageName = `${id}_${payload?.name?.firstName}`
    const path = file?.path
    const { secure_url } = await sendImageToCloudinay(imageName, path)
    modifiedUpdateData.profileImage = secure_url as string
  }

  const result = await Student.findByIdAndUpdate(id, modifiedUpdateData, {
    new: true,
    runValidators: true,
  })

  return result
}

const deleteStudentFromDB = async (id: string) => {
  if (!(await Student.isStudentExists(id))) {
    throw new AppError(400, 'This Student Dose not Existis!')
  }

  const session = await mongoose.startSession()

  try {
    session.startTransaction()

    const deletedStudent = await Student.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    )

    if (!deletedStudent) {
      throw new AppError(400, 'Failed to Delete Student')
    }

    const userId = deletedStudent.user
    const deletedUser = await User.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true, session },
    )
    if (!deletedUser) {
      throw new AppError(400, 'Failed to Delete User')
    }

    await session.commitTransaction()
    await session.endSession()
    return deletedStudent
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    await session.abortTransaction()
    await session.endSession()
    throw new AppError(400, 'Student Deleting Feiled!')
  }
}

export const StudentService = {
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  updateSingleStudentFromDB: updateSingleStudentIntoDB,
  deleteStudentFromDB,
}
