import {
  TAcademicSemesterCode,
  TAcademicSemesterName,
  TAcademicSemesterNameAndCodeMapper,
  TMonths,
} from './academic.Semeter.interface'

export const Months: TMonths[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export const AcademicSemeterName: TAcademicSemesterName[] = [
  'Autumn',
  'Summer',
  'Fall',
]
export const AcademicSemeterCode: TAcademicSemesterCode[] = ['01', '02', '03']

export const academicSemesterNameAndCodeMapper: TAcademicSemesterNameAndCodeMapper =
  {
    Autumn: '01',
    Summer: '02',
    Fall: '03',
  }

export const academicSemesterSearchAbleFields = ['name']
