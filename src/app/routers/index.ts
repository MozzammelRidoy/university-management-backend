import { Router } from 'express'
import { AcademicSemesterRoutes } from '../modules/academicSemester/academic.Semester.route'
import { AcademicFacultyRoutes } from '../modules/academicFaculty/academicFaculty.route'
import { AcademicDepartmentRoutes } from '../modules/academicDepartment/academicDepartment.route'
import { UserRoutes } from '../modules/user/users.route'
import { StudentRoutes } from '../modules/student/students.route'
import { FacultyRoutes } from '../modules/faculty/faculty.Route'
import { AdminRoutes } from '../modules/admin/admin.route'
import { CourseRoutes } from '../modules/course/course.route'
import { SemesterRegistrationRoutes } from './../modules/semesterRegistration/semesterRegistration.route'
import { OfferedCourseRoutes } from '../modules/offeredCoures/offeredCourses.route'
import { AuthRoutes } from '../modules/auth/auth.route'
import { EnrolledCourseRoutes } from '../modules/enrolledCourse/enrolledCourse.route'

const routers = Router()

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/students',
    route: StudentRoutes,
  },
  {
    path: '/faculties',
    route: FacultyRoutes,
  },
  {
    path: '/admins',
    route: AdminRoutes,
  },
  {
    path: '/academic-semester',
    route: AcademicSemesterRoutes,
  },
  {
    path: '/academic-faculties',
    route: AcademicFacultyRoutes,
  },
  {
    path: '/academic-departments',
    route: AcademicDepartmentRoutes,
  },
  {
    path: '/courses',
    route: CourseRoutes,
  },
  {
    path: '/semester-registrations',
    route: SemesterRegistrationRoutes,
  },
  {
    path: '/offered-courses',
    route: OfferedCourseRoutes,
  },
  {
    path: '/enrolled-courses',
    route: EnrolledCourseRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
]

moduleRoutes.forEach(router => routers.use(router.path, router.route))

export default routers
