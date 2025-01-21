import mongoose, { Schema } from 'mongoose'
import { TSemesterRegistration } from './semesterRegistration.interface'
import { SemesterRagistrationStatus } from './semesterRegistration.constant'

const SemesterRegistrationSchema = new mongoose.Schema<TSemesterRegistration>(
  {
    academicSemester: {
      type: Schema.Types.ObjectId,
      required: [true, 'Academic Semester is required'],
      unique: true,
      ref: 'AcademicSemester',
    },
    status: {
      type: String,
      enum: SemesterRagistrationStatus,
      default: 'UPCOMING',
      required: [true, 'Semester Ragistration Status is required'],
    },
    startDate: {
      type: Date,
      required: [true, 'Start Date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End Date is required'],
    },
    minCredit: {
      type: Number,
      required: [true, 'Min Credit is required al least 3'],
      default: 3,
    },
    maxCredit: {
      type: Number,
      required: [true, 'Max Credit is required'],
      default: 15,
    },
  },
  {
    timestamps: true,
  },
)

export const SemesterRegistration = mongoose.model<TSemesterRegistration>(
  'SemesterRegistration',
  SemesterRegistrationSchema,
)
