/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose'
import QueryBuilder from '../../builder/QueryBuilder'
import { courseSearchAbleFields } from './course.Constant'
import { TCourse, TCourseFaculty } from './course.Interface'
import { Course, CourseFaculty } from './course.Model'
import AppError from '../../errors/AppError'

const createCourseIntoDB = async (payload: TCourse) => {
  const result = await Course.create(payload)
  return result
}

const getSingleCourseFromDB = async (id: string) => {
  const result = await Course.findById(id).populate(
    'preRequisiteCourses.course',
  )
  return result
}

const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder(
    Course.find().populate('preRequisiteCourses.course'),
    query,
  )
    .search(courseSearchAbleFields)
    .filter()
    .sort()
    .paginate()
    .fields()

  const meta = await courseQuery.countTotal()
  const result = await courseQuery.modelQuery
  return { meta, result }
}

const updateCourseIntoDB = async (id: string, payload: Partial<TCourse>) => {
  const { preRequisiteCourses, ...courseRemainingData } = payload

  const session = await mongoose.startSession()
  try {
    session.startTransaction()

    //step : 1, Basic Course info update
    const udpateBasicCourseInfo = await Course.findByIdAndUpdate(
      id,
      courseRemainingData,
      { new: true, runValidators: true, session },
    )
    if (!udpateBasicCourseInfo) {
      throw new AppError(400, 'Failed to Course Update')
    }

    //   console.log(preRequisiteCourses)
    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      // filter out the deleted field
      const deletedPreRequisites = preRequisiteCourses
        .filter(el => el.course && el.isDeleted)
        .map(el => el.course)

      const deletedPreRequisitesCourses = await Course.findByIdAndUpdate(
        id,
        {
          $pull: {
            preRequisiteCourses: { course: { $in: deletedPreRequisites } },
          },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      )
      if (!deletedPreRequisitesCourses) {
        throw new AppError(400, 'Failed to Pre Requisite Update')
      }
      //filter out the new course filed
      const newPreRequisites = preRequisiteCourses.filter(
        el => el.course && !el.isDeleted,
      )
      const newPreRequisitesCourses = await Course.findByIdAndUpdate(
        id,
        {
          $addToSet: { preRequisiteCourses: { $each: newPreRequisites } },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      )
      if (!newPreRequisitesCourses) {
        throw new AppError(400, 'Failed Pre Requisite Add')
      }
    }
    await session.commitTransaction()
    await session.endSession()
    const result = await Course.findById(id).populate(
      'preRequisiteCourses.course',
    )
    return result
  } catch (err: any) {
    await session.abortTransaction()
    await session.endSession()
    throw new Error(err)
  }
}
const deleteCourseFromDB = async (id: string) => {
  const result = await Course.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  )
  return result
}

const assignFacultiesWithCourseIntoDB = async (
  id: string,
  payload: Partial<TCourseFaculty>,
) => {
  const result = await CourseFaculty.findByIdAndUpdate(
    id,
    {
      course: id,
      $addToSet: { faculties: { $each: payload } },
    },
    { upsert: true, new: true },
  )

  return result
}

const getFacultiesWithCourseFromDB = async (courseId: string) => {
  const result = await CourseFaculty.findOne({
    course: courseId,
  }).populate('faculties')

  return result
}

const removeFacultiesFromCourseFromDB = async (
  id: string,
  payload: Partial<TCourseFaculty>,
) => {
  const result = await CourseFaculty.findByIdAndUpdate(
    id,
    {
      $pull: { faculties: { $in: payload } },
    },
    { new: true },
  )

  return result
}
export const CourseServices = {
  createCourseIntoDB,
  getAllCoursesFromDB,
  getSingleCourseFromDB,
  updateCourseIntoDB,
  deleteCourseFromDB,
  assignFacultiesWithCourseIntoDB,
  getFacultiesWithCourseFromDB,
  removeFacultiesFromCourseFromDB,
}
