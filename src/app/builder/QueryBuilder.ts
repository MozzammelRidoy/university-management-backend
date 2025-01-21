import { FilterQuery, Query } from 'mongoose'

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>
  public query: Record<string, unknown>

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery
    this.query = query
  }

  search(searchAbleFileds: string[]) {
    const searchTerm = this?.query?.searchTerm
    if (searchTerm) {
      this.modelQuery = this.modelQuery.find({
        $or: searchAbleFileds.map(
          filed =>
            ({
              [filed]: { $regex: searchTerm, $options: 'i' },
            }) as FilterQuery<T>,
        ),
      })
    }
    return this
  }

  filter() {
    const queryObj = { ...this.query }
    const exludeFileds = ['searchTerm', 'sort', 'page', 'limit', 'fileds']

    exludeFileds.forEach(el => delete queryObj[el])
    this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>)

    return this
  }

  sort() {
    // const sort = this?.query?.sort || '-createdAt'
    const sort =
      (this?.query?.sort as string)?.split(',')?.join(' ') || '-createdAt'
    this.modelQuery = this.modelQuery.sort(sort as string)

    return this
  }

  paginate() {
    const page = Number(this?.query?.page) || 1
    const limit = Number(this?.query?.limit) || 10
    const skip = (page - 1) * limit

    this.modelQuery = this.modelQuery.skip(skip).limit(limit)
    return this
  }

  fields() {
    const fields =
      (this?.query?.fileds as string)?.split(',')?.join(' ') || '-__v'
    this.modelQuery = this.modelQuery.select(fields)
    return this
  }

  async countTotal() {
    const totalQueries = this.modelQuery.getFilter()
    const totalData = await this.modelQuery.model.countDocuments(totalQueries)
    const page = Number(this?.query?.page) || 1
    const limit = Number(this?.query?.limit) || 10
    const totalPage = Math.ceil(totalData / limit)

    return {
      page,
      limit,
      totalData,
      totalPage,
    }
  }
}

export default QueryBuilder

// =============> manual query.
// const getAllStudentsFromDB = async (query: Record<string, unknown>) => {
//   // {email : {$regex : query.searchTerm, $options : 'i'}}
//   // {presendAddress : {$regex : query.searchTerm, $options : 'i'}}
//   // {name.firstName : {$regex : query.searchTerm, $options : 'i'}}
//   const queryObj = { ...query }
//   const studentSearchableFileds = ['email', 'name.firstName', 'presentAddress']
//   let searchTerm = ''
//   if (query?.searchTerm) {
//     searchTerm = query.searchTerm as string
//   }

//   const searchQuery = Student.find({
//     $or: studentSearchableFileds.map(filed => ({
//       [filed]: { $regex: searchTerm, $options: 'i' },
//     })),
//   })

//   // filtering...
//   const exludeFileds = ['searchTerm', 'sort', 'page', 'limit', 'fileds']

//   exludeFileds.forEach(el => delete queryObj[el])
//   console.log(query, queryObj)

//   const filterQuery = searchQuery
//     .find(queryObj)
//     .populate('user')
//     .populate('addmissionSemester')
//     .populate({
//       path: 'academicDepartment',
//       populate: { path: 'academicFaculty' },
//     })

//   // sort query ...
//   let sort = '-createdAt'
//   if (query?.sort) {
//     sort = query.sort as string
//   }
//   const sortQuery = filterQuery.sort(sort)

//   // paginate query...
//   let limit = 1
//   let page = 1
//   let skip = 0

//   if (query?.limit) {
//     limit = Number(query.limit)
//   }

//   if (query?.page) {
//     page = Number(query.page)
//     skip = (page - 1) * limit
//   }

//   const paginateQuery = sortQuery.skip(skip)
//   // limi query...
//   const limitQuery = paginateQuery.limit(limit)

//   //filed limiting.
//   let fileds = '-__v'

//   if (query?.fileds) {
//     fileds = (query.fileds as string).split(',').join(' ')
//   }

//   const filedsQuery = await limitQuery.select(fileds)

//   return filedsQuery
// }
