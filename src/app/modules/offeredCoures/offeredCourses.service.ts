import QueryBuilder from '../../builder/QueryBuilder'
import AppError from '../../errors/AppError'
import { AcademicDepartment } from '../academicDepartment/academicDepartment.model'
import { AcademicFaculty } from '../academicFaculty/academicFaculty.model'
import { Course } from '../course/course.Model'
import { Faculty } from '../faculty/faculty.Model'
import { RegistrationStatus } from '../semesterRegistration/semesterRegistration.constant'
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model'
import { Student } from '../student/students.model'
import { hasTimeConflict } from './offeredCourse.utils'
import { TOfferedCourse } from './offeredCourses.interface'
import { OfferedCourse } from './offeredCourses.model'

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
  const {
    semesterRegistration,
    academicFaculty,
    academicDepartment,
    course,
    faculty,
    section,
    days,
    startTime,
    endTime,
  } = payload

  //check if the semester registration id is exists.
  const isSemesterRegistrationExists =
    await SemesterRegistration.findById(semesterRegistration)
  if (!isSemesterRegistrationExists) {
    throw new AppError(404, 'Semester Registration not found!')
  }

  const academicSemester = isSemesterRegistrationExists.academicSemester

  //check if the academicFaculty id is exists.
  const isAcademicFacultyExists =
    await AcademicFaculty.findById(academicFaculty)
  if (!isAcademicFacultyExists) {
    throw new AppError(404, 'Academic Faculty not found!')
  }

  //check if the academicDepartment id is exists.
  const isAcademicDepartmentExists =
    await AcademicDepartment.findById(academicDepartment)
  if (!isAcademicDepartmentExists) {
    throw new AppError(404, 'Academic Department not found!')
  }

  //check if the Course id is exists.
  const isCourseExists = await Course.findById(course)
  if (!isCourseExists) {
    throw new AppError(404, 'Course not found!')
  }

  //check if the Course id is exists.
  const isFacultyExists = await Faculty.findById(faculty)
  if (!isFacultyExists) {
    throw new AppError(404, 'Faculty not found!')
  }

  //check if the department is belong to the faculty.
  const isDepartmentBelongToFaculty = await AcademicDepartment.findOne({
    _id: academicDepartment,
    academicFaculty,
  })
  if (!isDepartmentBelongToFaculty) {
    throw new AppError(
      404,
      `This ${isAcademicDepartmentExists.name} is not belong to ${isAcademicFacultyExists.name}!`,
    )
  }

  // check if the same offered course same section in same registration semester is already exists.
  const isOfferedCourseExistsWithSameRegisteredSemesterWithSameSection =
    await OfferedCourse.findOne({
      semesterRegistration,
      course,
      section,
    })

  if (isOfferedCourseExistsWithSameRegisteredSemesterWithSameSection) {
    throw new AppError(
      400,
      `Offered Course with same section is already exists.`,
    )
  }

  // get the schedule of the faculties.
  const assingedSchedule = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select('days startTime endTime')

  const newSchedule = { days, startTime, endTime }

  if (hasTimeConflict(assingedSchedule, newSchedule)) {
    throw new AppError(
      400,
      `This Faculty is not available at this time! Choose other time or days`,
    )
  }

  //finally create offered course.
  const result = await OfferedCourse.create({ ...payload, academicSemester })
  return result
}

const getAllOfferedCoursesFromDB = async (query: Record<string, unknown>) => {
  const offeredCourseQuery = new QueryBuilder(
    OfferedCourse.find().populate(
      'semesterRegistration academicSemester academicFaculty academicDepartment course faculty',
    ),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields()
  const result = await offeredCourseQuery.modelQuery
  const meta = await offeredCourseQuery.countTotal()

  return { meta, result }
}

const getMyOfferedCoursesFromDB = async (
  userId: string,
  query: Record<string, unknown>,
) => {
  // pagination setup.
  const page = Number(query?.page) || 1
  const limit = Number(query?.limit) || 10
  const skip = (page - 1) * limit

  // find the student.
  const student = await Student.findOne({ id: userId })

  if (!student) {
    throw new AppError(404, 'User is not found!')
  }

  //find the ongoing semester.
  const currentOngoingSemesterRegistration = await SemesterRegistration.findOne(
    {
      status: 'ONGOING',
    },
  )

  if (!currentOngoingSemesterRegistration) {
    throw new AppError(404, 'There is no ongoing semester registration!')
  }

  const aggregationQuery = [
    {
      $match: {
        semesterRegistration: currentOngoingSemesterRegistration._id,
        academicFaculty: student.academicFaculty,
        academicDepartment: student.academicDepartment,
      },
    },
    {
      $lookup: {
        from: 'courses',
        localField: 'course',
        foreignField: '_id',
        as: 'course',
      },
    },
    {
      $unwind: '$course',
    },
    {
      $lookup: {
        from: 'enrolledcourses',
        let: {
          currentOngoingSemesterRegistration:
            currentOngoingSemesterRegistration._id,
          currentStudent: student._id,
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: [
                      '$semesterRegistration',
                      '$$currentOngoingSemesterRegistration',
                    ],
                  },
                  {
                    $eq: ['$student', '$$currentStudent'],
                  },
                  {
                    $eq: ['$isEnrolled', true],
                  },
                ],
              },
            },
          },
        ],
        as: 'enrolledCourses',
      },
    },
    {
      $lookup: {
        from: 'enrolledcourses',
        let: {
          currentStudent: student._id,
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ['$student', '$$currentStudent'],
                  },
                  {
                    $eq: ['$isCompleted', true],
                  },
                ],
              },
            },
          },
        ],
        as: 'completedCourses',
      },
    },
    {
      $addFields: {
        completedCourseIds: {
          $map: {
            input: '$completedCourses',
            as: 'completed',
            in: '$$completed.course',
          },
        },
      },
    },

    {
      $addFields: {
        isPreRequisitesFullFiled: {
          $or: [
            {
              $eq: ['$course.preRequisiteCourses', []],
            },
            {
              $setIsSubset: [
                '$course.preRequisiteCourses.course',
                '$completedCourseIds',
              ],
            },
          ],
        },

        isAlreadyEnrolled: {
          $in: [
            '$course._id',
            {
              $map: {
                input: '$enrolledCourses',
                as: 'enroll',
                in: '$$enroll.course',
              },
            },
          ],
        },
      },
    },
    {
      $match: {
        isAlreadyEnrolled: false,
        isPreRequisitesFullFiled: true,
      },
    },
  ]
  const paginationQuery = [
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
  ]

  const result = await OfferedCourse.aggregate([
    ...aggregationQuery,
    ...paginationQuery,
  ])

  const totalData = (await OfferedCourse.aggregate(aggregationQuery)).length
  const totalPage = Math.ceil(totalData / limit)
  return {
    meta: {
      page,
      limit,
      totalData,
      totalPage,
    },
    result,
  }
}

const getSingleOfferedCourseFromDB = async (id: string) => {
  const result = await OfferedCourse.findById(id)
  return result
}

const updateOfferedCourseIntoDB = async (
  id: string,
  payload: Pick<TOfferedCourse, 'faculty' | 'days' | 'startTime' | 'endTime'>,
) => {
  const { faculty, days, startTime, endTime } = payload

  //check if the offered course id is exists.
  const isOfferedCourseExists = await OfferedCourse.findById(id)
  if (!isOfferedCourseExists) {
    throw new AppError(404, 'Offered Course not found!')
  }

  // check if the semester registration is Upcoming.
  const semesterRegistration = isOfferedCourseExists.semesterRegistration
  const semesterRegistrationStatus =
    await SemesterRegistration.findById(semesterRegistration).select('status')
  if (semesterRegistrationStatus?.status !== RegistrationStatus.UPCOMING) {
    throw new AppError(
      400,
      `You can not update this offered course as it is ${semesterRegistrationStatus?.status} `,
    )
  }

  // check if the faculty is exists.
  const isFacultyExists = await Faculty.findById(faculty)
  if (!isFacultyExists) {
    throw new AppError(404, 'Faculty not found!')
  }

  // get the schedule of the faculties.
  const assingedSchedule = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select('days startTime endTime')

  const newSchedule = { days, startTime, endTime }

  if (hasTimeConflict(assingedSchedule, newSchedule)) {
    throw new AppError(
      400,
      `This Faculty is not available at this time! Choose other time or days`,
    )
  }

  //finally update the offered course.
  const result = await OfferedCourse.findByIdAndUpdate(id, payload, {
    new: true,
  })
  return result
}

export const OfferedCourseServices = {
  createOfferedCourseIntoDB,
  getAllOfferedCoursesFromDB,
  getMyOfferedCoursesFromDB,
  getSingleOfferedCourseFromDB,
  updateOfferedCourseIntoDB,
}
