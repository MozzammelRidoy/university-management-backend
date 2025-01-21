import { Model, Types } from 'mongoose'

export type TFaculyName = {
  firstName: string
  middleName?: string
  lastName: string
}

export type TGender = 'male' | 'female' | 'other'
export type TBloodGroup =
  | 'A+'
  | 'A-'
  | 'B+'
  | 'B-'
  | 'AB+'
  | 'AB-'
  | 'O+'
  | 'O-'

export type TFaculty = {
  id: string
  user: Types.ObjectId
  degisnation: string
  name: TFaculyName
  gender: TGender
  dateOfBirth: Date
  bloodGroup?: TBloodGroup
  email: string
  contactNo: string
  emergencyContactNo: string
  presentAddress: string
  permanentAddress: string
  profileImage?: string
  academicDepartment: Types.ObjectId
  academicFaculty: Types.ObjectId
  isDeleted: boolean
}

export interface FacultyModel extends Model<TFaculty> {
  isUserExists(id: string): Promise<TFaculty | null>
}
