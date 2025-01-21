import { model, Schema } from 'mongoose'
import { FacultyModel, TFaculty, TFaculyName } from './faculty.Interface'
import { BloodGroup, Gender } from './faculty.Constant'

const FacultyNameSchema = new Schema<TFaculyName>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    middleName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
  },
)

const FacultySchema = new Schema<TFaculty>(
  {
    id: {
      type: String,
      required: [true, 'ID is required'],
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'user must be required'],
      unique: true,
      ref: 'User',
    },
    degisnation: {
      type: String,
      required: [true, 'Designation is required'],
      trim: true,
    },
    name: {
      type: FacultyNameSchema,
      required: [true, 'Name is requried'],
    },
    gender: {
      type: String,
      enum: {
        values: Gender,
        message: '{VALUE} is not Valid',
      },

      required: [true, 'Gender is required'],
    },
    dateOfBirth: { type: Date },
    bloodGroup: {
      type: String,
      enum: {
        values: BloodGroup,
        message: '{VALUE} is not a valid blood group',
      },
      trim: true,
    },
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
    profileImage: { type: String, default: '' },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      required: [true, 'Acadcemic Department is required'],
      ref: 'AcademicDepartment',
    },
    academicFaculty: {
      type: Schema.Types.ObjectId,
      required: [true, 'Acadcemic Faculty is required'],
      ref: 'AcademicFaculty',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
)

// generating full name
FacultySchema.virtual('fullName').get(function () {
  return `${this?.name?.firstName} ${this?.name?.middleName} ${this?.name?.lastName}`
})

// filter out deleted documents
FacultySchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } })
  next()
})

FacultySchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } })
  next()
})

FacultySchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } })
  next()
})

//checking if user is already exist!
FacultySchema.statics.isUserExists = async function (id: string) {
  const existingUser = await Faculty.findOne({ id })
  return existingUser
}

export const Faculty = model<TFaculty, FacultyModel>('Faculty', FacultySchema)
