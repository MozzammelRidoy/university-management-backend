import QueryBuilder from '../../builder/QueryBuilder'
import AppError from '../../errors/AppError'
import { AcademicSemeter } from '../academicSemester/academic.Semester.model'
import { RegistrationStatus } from './semesterRegistration.constant'
import { TSemesterRegistration } from './semesterRegistration.interface'
import { SemesterRegistration } from './semesterRegistration.model'

const createSemesterRegistrationIntoDB = async (
  payload: TSemesterRegistration,
) => {
  //check if the semester is exist
  const academicSemester = payload?.academicSemester

  const isAcademicSemesterExists =
    await AcademicSemeter.findById(academicSemester)
  if (!isAcademicSemesterExists) {
    throw new AppError(404, 'This Academic Semester not found!')
  }

  // check if the semester is already registered
  const isSemesterRegistrationExists = await SemesterRegistration.findOne({
    academicSemester,
  })
  if (isSemesterRegistrationExists) {
    throw new AppError(400, 'This Semester is already registered')
  }

  // check if there any regestered semester that is already "UPCOMING" | "ONGOING"
  const isThereAnyUpcomingOrOngoingSemester =
    await SemesterRegistration.findOne({
      $or: [
        { status: RegistrationStatus.UPCOMING },
        { status: RegistrationStatus.ONGOING },
      ],
    })
  if (isThereAnyUpcomingOrOngoingSemester) {
    throw new AppError(
      400,
      `There is already an ${isThereAnyUpcomingOrOngoingSemester.status} registered semester!`,
    )
  }
  const result = await SemesterRegistration.create(payload)

  return result
}

const getAllSemesterRegistrationsFromDB = async (
  query: Record<string, unknown>,
) => {
  const semesterRegistrationQuery = new QueryBuilder(
    SemesterRegistration.find().populate('academicSemester'),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields()

  const result = await semesterRegistrationQuery.modelQuery
  const meta = await semesterRegistrationQuery.countTotal()

  return { meta, result }
}

const getSingleSemesterRegistrationFromDB = async (id: string) => {
  const result =
    await SemesterRegistration.findById(id).populate('academicSemester')
  return result
}

const updateSemesterRegistrationIntoDB = async (
  id: string,
  payload: Partial<TSemesterRegistration>,
) => {
  // check if the requested registered semester is exists.
  const isSemesterRegistrationExists = await SemesterRegistration.findById(id)
  if (!isSemesterRegistrationExists) {
    throw new AppError(404, 'This Semester not Found!')
  }

  //if the registered semester registration is ended. we will not update anything.
  const currentSemesterStatus = isSemesterRegistrationExists?.status
  if (currentSemesterStatus === RegistrationStatus.ENDED) {
    throw new AppError(400, `This semester is already ${currentSemesterStatus}`)
  }

  //UPCOMING --> ONGOING --> ENDED
  const requestedStatus = payload?.status
  if (
    currentSemesterStatus === RegistrationStatus.UPCOMING &&
    requestedStatus === RegistrationStatus.ENDED
  ) {
    throw new AppError(
      400,
      `You can not directly change status from ${currentSemesterStatus} to ${requestedStatus}`,
    )
  }

  if (
    currentSemesterStatus === RegistrationStatus.ONGOING &&
    requestedStatus === RegistrationStatus.UPCOMING
  ) {
    throw new AppError(
      400,
      `You can not directly change status from ${currentSemesterStatus} to ${requestedStatus}`,
    )
  }

  const result = await SemesterRegistration.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  })

  return result
}

const deleteSemesterRegistrationIntoDB = async (id: string) => {}

export const SemesterRegistrationServices = {
  createSemesterRegistrationIntoDB,
  getAllSemesterRegistrationsFromDB,
  getSingleSemesterRegistrationFromDB,
  updateSemesterRegistrationIntoDB,
  deleteSemesterRegistrationIntoDB,
}
