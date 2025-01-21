import { model, Schema } from 'mongoose'
import { TAcademicSemester } from './academic.Semeter.interface'
import {
  AcademicSemeterCode,
  AcademicSemeterName,
  Months,
} from './academic.Semester.constant'

const academicSemesterSchema = new Schema<TAcademicSemester>(
  {
    name: {
      type: String,
      enum: AcademicSemeterName,
      required: true,
    },
    code: {
      type: String,
      enum: AcademicSemeterCode,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    startMonth: {
      type: String,
      enum: Months,
      required: true,
    },
    endMonth: {
      type: String,
      enum: Months,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

academicSemesterSchema.pre('save', async function (next) {
  const isSemesterExists = await AcademicSemeter.findOne({
    year: this.year,
    name: this.name,
  })
  if (isSemesterExists) {
    throw new Error('Semester is Already exists!')
  }
  next()
})

academicSemesterSchema.pre('updateOne', async function (next) {
  const updateData = this.getUpdate()

  if (updateData && '$set' in updateData) {
    const { year, name } = updateData.$set || {}

    if (!year || !name) return next()

    const isSemesterExists = await AcademicSemeter.findOne({
      year,
      name,
    })
    if (isSemesterExists) {
      throw new Error('Semester is Already exists!')
    }
  }
  next()
})

export const AcademicSemeter = model<TAcademicSemester>(
  'AcademicSemester',
  academicSemesterSchema,
)
