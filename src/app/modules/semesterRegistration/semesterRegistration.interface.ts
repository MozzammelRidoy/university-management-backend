import { Types } from 'mongoose'
export type TRegistrationStatus = 'UPCOMING' | 'ONGOING' | 'ENDED'

export type TSemesterRegistration = {
  academicSemester: Types.ObjectId
  status: TRegistrationStatus
  startDate: Date
  endDate: Date
  minCredit: number
  maxCredit: number
}
