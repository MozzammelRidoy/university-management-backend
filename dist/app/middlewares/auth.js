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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const users_model_1 = require("../modules/user/users.model");
//Bangla system. not best practice.
// interface CustomRequest extends Request {
//   user: JwtPayload
// }
const auth = (...requiredRole) => {
    return (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const token = req.headers.authorization;
        // if the token is sent from the client.
        if (!token) {
            throw new AppError_1.default(401, 'You are not authorized.');
        }
        // check if the token is valid.
        // jwt.verify(
        //   token,
        //   config.jwt_access_token_secret as string,
        //   (err, decoded) => {
        //     if (err) {
        //       throw new AppError(401, 'You are not authorized.')
        //     }
        //     const role = (decoded as JwtPayload).role
        //     if (requiredRole && !requiredRole.includes(role)) {
        //       throw new AppError(401, 'You are not authorized.')
        //     }
        //     // set the user to the request object.
        //     req.user = decoded as JwtPayload
        //     next()
        //   },
        // )
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_token_secret);
        const { userId, role, iat } = decoded;
        //checking if the user is exist in the database
        const user = yield users_model_1.User.isUserExistsByCustomeId(userId);
        if (!user) {
            throw new AppError_1.default(404, 'This user is not found!');
        }
        // checking if the user is alrady deleted.
        const isDeleted = user === null || user === void 0 ? void 0 : user.isDeleted;
        if (isDeleted) {
            throw new AppError_1.default(403, 'This user is deleted!');
        }
        // checking if the user is blocked
        const userStatus = user === null || user === void 0 ? void 0 : user.status;
        if (userStatus === 'blocked') {
            throw new AppError_1.default(403, 'This user is blocked!');
        }
        if (user.passwordChangedAt &&
            users_model_1.User.isJWTIssuedAtBeforePasswordChanged(user.passwordChangedAt, iat)) {
            throw new AppError_1.default(401, 'You are not authorized.');
        }
        if (requiredRole && !requiredRole.includes(role)) {
            throw new AppError_1.default(401, 'You are not authorized.');
        }
        // set the user to the request object.
        req.user = decoded;
        next();
    }));
};
exports.default = auth;
