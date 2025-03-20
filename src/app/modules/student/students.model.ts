import { model, Schema } from 'mongoose'
import {
  StudentModel,
  TGuardian,
  TLocalGuardian,
  TStudent,
  TUserName,
} from './students.interface'

const UserNameSchema = new Schema<TUserName>(
  {
    firstName: {
      type: String,
      required: [true, 'First Name is Required'],
      maxlength: [20, 'First Name Can not be More Than 20 characters.'],
      trim: true,
    },
    middleName: { type: String, trim: true },
    lastName: {
      type: String,
      required: [true, 'Last Name is Required'],
      maxlength: [20, 'Last Name Can not be More Than 20 characters.'],
      trim: true,
    },
  },
  {
    _id: false,
  },
)

const GuardianSchema = new Schema<TGuardian>(
  {
    fatherName: {
      type: String,
      required: [true, 'Father Name is Required'],
      trim: true,
    },
    fatherOccupation: {
      type: String,
      required: [true, 'Father Occupation is Required'],
      trim: true,
    },
    fatherContactNo: {
      type: String,
      required: [true, 'Father Contact Number is Required'],
      trim: true,
    },
    motherName: {
      type: String,
      required: [true, 'Mother Name is Required'],
      trim: true,
    },
    motherOccupation: {
      type: String,
      required: [true, 'Mother Occupation is Required'],
      trim: true,
    },
    motherContactNo: {
      type: String,
      required: [true, 'Mother Contact No is Required'],
      trim: true,
    },
  },
  {
    _id: false,
  },
)
const LocalGuardianSchema = new Schema<TLocalGuardian>(
  {
    name: {
      type: String,
      required: [true, 'Local Guardian Name is Required'],
      trim: true,
    },
    occupation: {
      type: String,
      required: [true, 'Local G Occupation is Required'],
      trim: true,
    },
    contactNo: {
      type: String,
      required: [true, 'Local G Contact No is Required'],
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
  },
  {
    _id: false,
  },
)

const studentSchema = new Schema<TStudent>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'user must be is required'],
      unique: true,
      ref: 'User',
    },
    name: {
      type: UserNameSchema,
      required: true,
    },
    gender: {
      type: String,
      enum: {
        values: ['male', 'female', 'other'],
        message: '{VALUE} is not Valid',
      },

      required: true,
      trim: true,
    },
    dateOfBirth: { type: String, trim: true },
    email: {
      type: String,
      required: [true, 'Email is Required'],
      unique: true,
      trim: true,
    },
    contactNo: {
      type: String,
      required: [true, 'Contact Number is Required'],
      trim: true,
    },
    emergencyContactNo: {
      type: String,
      required: [true, 'Emergency Contact Number is Required'],
      trim: true,
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'AB+', 'AB-', 'B+', 'B-', 'O+', 'O-'],
      trim: true,
    },
    presentAddress: {
      type: String,
      required: [true, 'Pressent Address is Required'],
      trim: true,
    },
    permanentAddress: {
      type: String,
      required: [true, 'Permanent Address is Required'],
      trim: true,
    },
    guardian: { type: GuardianSchema, required: true },
    localGuardian: { type: LocalGuardianSchema, required: true },
    profileImage: { type: String, default: '' },
    addmissionSemester: {
      type: Schema.ObjectId,
      required: true,
      ref: 'AcademicSemester',
    },
    academicDepartment: {
      type: Schema.ObjectId,
      required: true,
      ref: 'AcademicDepartment',
    },
    academicFaculty: {
      type: Schema.ObjectId,
      required: true,
      ref: 'AcademicFaculty',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
)

// query middleware
studentSchema.pre('find', async function (next) {
  this.find({ isDeleted: { $ne: true } })
  next()
})

studentSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } })
  next()
})

studentSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } })
  next()
})

studentSchema.statics.isStudentExists = async function (id: string) {
  const existingStudent = await Student.findOne({ id })
  return existingStudent
}

export const Student = model<TStudent, StudentModel>('Student', studentSchema)
