"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class QueryBuilder {
    constructor(modelQuery, query) {
        this.modelQuery = modelQuery;
        this.query = query;
    }
    search(searchAbleFileds) {
        var _a;
        const searchTerm = (_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.searchTerm;
        if (searchTerm) {
            this.modelQuery = this.modelQuery.find({
                $or: searchAbleFileds.map(filed => ({
                    [filed]: { $regex: searchTerm, $options: 'i' },
                })),
            });
        }
        return this;
    }
    filter() {
        const queryObj = Object.assign({}, this.query);
        const exludeFileds = ['searchTerm', 'sort', 'page', 'limit', 'fileds'];
        exludeFileds.forEach(el => delete queryObj[el]);
        this.modelQuery = this.modelQuery.find(queryObj);
        return this;
    }
    sort() {
        var _a, _b, _c;
        // const sort = this?.query?.sort || '-createdAt'
        const sort = ((_c = (_b = (_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.sort) === null || _b === void 0 ? void 0 : _b.split(',')) === null || _c === void 0 ? void 0 : _c.join(' ')) || '-createdAt';
        this.modelQuery = this.modelQuery.sort(sort);
        return this;
    }
    paginate() {
        var _a, _b;
        const page = Number((_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.page) || 1;
        const limit = Number((_b = this === null || this === void 0 ? void 0 : this.query) === null || _b === void 0 ? void 0 : _b.limit) || 10;
        const skip = (page - 1) * limit;
        this.modelQuery = this.modelQuery.skip(skip).limit(limit);
        return this;
    }
    fields() {
        var _a, _b, _c;
        const fields = ((_c = (_b = (_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.fileds) === null || _b === void 0 ? void 0 : _b.split(',')) === null || _c === void 0 ? void 0 : _c.join(' ')) || '-__v';
        this.modelQuery = this.modelQuery.select(fields);
        return this;
    }
    countTotal() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const totalQueries = this.modelQuery.getFilter();
            const totalData = yield this.modelQuery.model.countDocuments(totalQueries);
            const page = Number((_a = this === null || this === void 0 ? void 0 : this.query) === null || _a === void 0 ? void 0 : _a.page) || 1;
            const limit = Number((_b = this === null || this === void 0 ? void 0 : this.query) === null || _b === void 0 ? void 0 : _b.limit) || 10;
            const totalPage = Math.ceil(totalData / limit);
            return {
                page,
                limit,
                totalData,
                totalPage,
            };
        });
    }
}
exports.default = QueryBuilder;
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
