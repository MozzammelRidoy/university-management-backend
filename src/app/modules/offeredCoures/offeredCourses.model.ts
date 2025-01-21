import mongoose, { Schema } from 'mongoose'
import { TOfferedCourse } from './offeredCourses.interface'
import { Days } from './offeredCourses.constant'

const OfferedCourseSchema = new mongoose.Schema<TOfferedCourse>(
  {
    semesterRegistration: {
      type: Schema.Types.ObjectId,
      required: [true, 'Semester Registration is required'],
      ref: 'SemesterRegistration',
    },
    academicSemester: {
      type: Schema.Types.ObjectId,
      required: [true, 'Academic Semester is required'],
      ref: 'AcademicSemester',
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      required: [true, 'Academic Faculty is required'],
      ref: 'AcademicFaculty',
    },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      required: [true, 'Academic Department is required'],
      ref: 'AcademicDepartment',
    },
    course: {
      type: Schema.Types.ObjectId,
      required: [true, 'Course is required'],
      ref: 'Course',
    },
    faculty: {
      type: Schema.Types.ObjectId,
      required: [true, 'Faculty is required'],
      ref: 'Faculty',
    },
    maxCapacity: {
      type: Number,
      required: [true, 'Max Capacity is required'],
    },
    section: {
      type: Number,
      required: [true, 'Section is required'],
    },
    days: [
      {
        type: String,
        enum: Days,
      },
    ],
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
    },
  },
  {
    timestamps: true,
  },
)

export const OfferedCourse = mongoose.model<TOfferedCourse>(
  'OfferedCourse',
  OfferedCourseSchema,
)
