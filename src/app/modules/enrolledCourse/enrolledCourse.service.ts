/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose'
import AppError from '../../errors/AppError'
import { OfferedCourse } from '../offeredCoures/offeredCourses.model'
import { Student } from '../student/students.model'
import { TEnrolledCourse } from './enrolledCourse.interface'
import { EnrolledCourse } from './enrolledCourse.model'
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model'
import { Course } from '../course/course.Model'
import { Faculty } from '../faculty/faculty.Model'
import { calculateGradeAndPoints } from './enrolledCourse.utils'
import QueryBuilder from '../../builder/QueryBuilder'

const createEnrolledCourseIntoDB = async (
  userId: string,
  payload: TEnrolledCourse,
) => {
  /**
   * Step1 : Check if the offerd courses is exists.
   * Step2 : Check if the student is already enrolled.
   * Step3 : Check if the max credits exceed.
   * Step4 : Create and Enrolled coruse.
   */
  const { offeredCourse } = payload

  const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse)
  if (!isOfferedCourseExists) {
    throw new AppError(404, 'Offered Course Not Found!')
  }

  if (isOfferedCourseExists.maxCapacity <= 0) {
    throw new AppError(400, 'Room is Full!')
  }

  const student = await Student.findOne({ id: userId }, { _id: 1 })
  if (!student) {
    throw new AppError(404, 'Student Not Found!')
  }

  const isStudentAlreadyEnrolled = await EnrolledCourse.findOne({
    semesterRegistration: isOfferedCourseExists?.semesterRegistration,
    offeredCourse,
    student: student?._id,
  })
  if (isStudentAlreadyEnrolled) {
    throw new AppError(400, 'Student is Already Enrolled!')
  }

  // check total credits exceeds maxCredits.

  const semesterRegistration = await SemesterRegistration.findById(
    isOfferedCourseExists.semesterRegistration,
  ).select('maxCredit')

  const maxCredits = semesterRegistration?.maxCredit
  // total enrolled credit + new enrolled course credit > maxCredit
  const enrolledCourses = await EnrolledCourse.aggregate([
    {
      $match: {
        semesterRegistration: isOfferedCourseExists.semesterRegistration,
        student: student._id,
      },
    },
    {
      $lookup: {
        from: 'courses',
        localField: 'course',
        foreignField: '_id',
        as: 'enrolledCourseData',
      },
    },
    {
      $unwind: '$enrolledCourseData',
    },
    {
      $group: {
        _id: null,
        totalEnrolledCretids: { $sum: '$enrolledCourseData.credits' },
      },
    },
    {
      $project: {
        _id: 0,
        totalEnrolledCretids: 1,
      },
    },
  ])

  const course = await Course.findById(isOfferedCourseExists.course).select(
    'credits',
  )
  const currentCredits = course?.credits

  const totalCredits =
    enrolledCourses.length > 0 ? enrolledCourses[0].totalEnrolledCretids : 0

  if (
    totalCredits &&
    maxCredits &&
    totalCredits + currentCredits > maxCredits
  ) {
    throw new AppError(400, 'You have exceeded maximum number of credits!')
  }

  const session = await mongoose.startSession()
  try {
    session.startTransaction()

    const result = await EnrolledCourse.create(
      [
        {
          semesterRegistration: isOfferedCourseExists.semesterRegistration,
          academicSemester: isOfferedCourseExists.academicSemester,
          academicFaculty: isOfferedCourseExists.academicFaculty,
          academicDepartment: isOfferedCourseExists.academicDepartment,
          offeredCourse,
          course: isOfferedCourseExists.course,
          student: student._id,
          faculty: isOfferedCourseExists.faculty,
          isEnrolled: true,
        },
      ],
      { session },
    )

    if (!result) {
      throw new AppError(400, 'Failed to Enroll in this course!')
    }

    const maxCapacity = isOfferedCourseExists.maxCapacity

    await OfferedCourse.findByIdAndUpdate(
      offeredCourse,
      {
        maxCapacity: maxCapacity - 1,
      },
      { session },
    )

    await session.commitTransaction()
    await session.endSession()
    return result
  } catch (err: any) {
    await session.abortTransaction()
    await session.endSession()
    throw new Error(err)
  }
}

const getMyEnrolledCoursesFromDB = async (
  studentId: string,
  query: Record<string, unknown>,
) => {
  const student = await Student.findOne({ id: studentId })
  if (!student) {
    throw new AppError(404, 'Student not found!')
  }
  const enrolledCourseQuery = new QueryBuilder(
    EnrolledCourse.find({ student: student._id }).populate(
      'semesterRegistration academicSemester academicFaculty academicDepartment offeredCourse course student faculty',
    ),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields()

  const result = await enrolledCourseQuery.modelQuery
  const meta = await enrolledCourseQuery.countTotal()

  return {
    meta,
    result,
  }
}

const updateEnrolledCourseMarksIntoDB = async (
  facultyId: string,
  payload: Partial<TEnrolledCourse>,
) => {
  const { semesterRegistration, offeredCourse, student, courseMarks } = payload

  const isSemesterRegistration =
    await SemesterRegistration.findById(semesterRegistration)

  if (!isSemesterRegistration) {
    throw new AppError(404, 'Semester Registration not Found!')
  }

  const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse)
  if (!isOfferedCourseExists) {
    throw new AppError(404, 'Offered Course is Not Found!')
  }

  const isStudentExists = await Student.findById(student)

  if (!isStudentExists) {
    throw new AppError(404, 'Student is not found!')
  }
  const faculty = await Faculty.findOne({ id: facultyId }, { _id: 1 })

  const isCourseBelongToFaculty = await EnrolledCourse.findOne({
    semesterRegistration,
    offeredCourse,
    student,
    faculty: faculty?._id,
  })

  if (!isCourseBelongToFaculty) {
    throw new AppError(403, 'You are Forbidden!')
  }

  const modifiedData: Record<string, unknown> = {
    ...courseMarks,
  }

  if (courseMarks?.finalTerm) {
    const { classTest1, classTest2, midTerm, finalTerm } =
      isCourseBelongToFaculty.courseMarks

    const totalMarks =
      // Math.ceil(classTest1 * 0.1) +
      // Math.ceil(midTerm * 0.3) +
      // Math.ceil(classTest2 * 0.1) +
      // Math.ceil(finalTerm * 0.5)

      Math.ceil(classTest1) +
      Math.ceil(midTerm) +
      Math.ceil(classTest2) +
      Math.ceil(finalTerm)
    const result = calculateGradeAndPoints(totalMarks)

    modifiedData.grade = result.grade
    modifiedData.gradePoints = result.gradePoints
    modifiedData.isCompleted = true
  }

  if (courseMarks && Object.keys(courseMarks).length) {
    for (const [key, value] of Object.entries(courseMarks)) {
      modifiedData[`courseMarks.${key}`] = value
    }
  }

  const result = await EnrolledCourse.findByIdAndUpdate(
    isCourseBelongToFaculty._id,
    modifiedData,
    {
      new: true,
    },
  )

  return result
}

export const EnrolledCourseServices = {
  createEnrolledCourseIntoDB,
  getMyEnrolledCoursesFromDB,
  updateEnrolledCourseMarksIntoDB,
}
