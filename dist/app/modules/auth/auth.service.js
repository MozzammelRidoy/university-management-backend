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
exports.AuthServices = void 0;
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const users_model_1 = require("../user/users.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_utils_1 = require("./auth.utils");
const sendEmail_1 = require("../../utils/sendEmail");
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    //checking if the user is exist in the database
    const user = yield users_model_1.User.isUserExistsByCustomeId(payload === null || payload === void 0 ? void 0 : payload.id);
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
    // checking  if the password is correct
    //   const isPasswordMatched = await bcrypt.compare(
    //     payload?.password,
    //     isUserExist?.password,
    //   )
    if (!(yield users_model_1.User.isPasswordMached(payload === null || payload === void 0 ? void 0 : payload.password, user === null || user === void 0 ? void 0 : user.password))) {
        throw new AppError_1.default(403, 'Password do not matched!');
    }
    // create token and sent to the client
    const jwtPayload = {
        userId: user.id,
        role: user.role,
    };
    // const accessToken = jwt.sign(
    //   jwtPayload,
    //   config.jwt_access_token_secret as string,
    //   { expiresIn: '10d' },
    // )
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_token_secret, config_1.default.jwt_access_token_expiry);
    const refreshToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_refresh_token_secret, config_1.default.jwt_refresh_token_expiry);
    return {
        accessToken,
        refreshToken,
        needPasswordChange: user === null || user === void 0 ? void 0 : user.needsPasswordChange,
    };
});
const changePassword = (userData, payload) => __awaiter(void 0, void 0, void 0, function* () {
    //checking if the user is exist in the database
    const user = yield users_model_1.User.isUserExistsByCustomeId(userData.userId);
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
    if (!(yield users_model_1.User.isPasswordMached(payload === null || payload === void 0 ? void 0 : payload.oldPassword, user === null || user === void 0 ? void 0 : user.password))) {
        throw new AppError_1.default(403, 'Password do not matched!');
    }
    // hashed new password
    const newHashedPassword = yield bcrypt_1.default.hash(payload.newPassword, Number(config_1.default.bcrypt_salt_rounds));
    yield users_model_1.User.findOneAndUpdate({
        id: userData.userId,
        role: userData.role,
    }, {
        password: newHashedPassword,
        needsPasswordChange: false,
        passwordChangedAt: new Date(),
    });
    return null;
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    // if the token is sent from the client.
    if (!token) {
        throw new AppError_1.default(401, 'You are not authorized.');
    }
    // check if the token is valid.
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_refresh_token_secret);
    const { userId, iat } = decoded;
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
    const jwtPayload = {
        userId: user.id,
        role: user.role,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_token_secret, config_1.default.jwt_access_token_expiry);
    return {
        accessToken,
    };
});
// forget password
const forgetPassword = (userId) => __awaiter(void 0, void 0, void 0, function* () {
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
    const jwtPayload = {
        userId: user.id,
        role: user.role,
    };
    const resetToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_token_secret, '10m');
    const resetUILink = `${config_1.default.reset_pass_ui_link}?id=${user.id}&token=${resetToken}`;
    (0, sendEmail_1.sendEmail)(user.email, resetUILink);
});
//reset password.
const resetPassword = (payload, userData) => __awaiter(void 0, void 0, void 0, function* () {
    if (userData.userId !== payload.id) {
        throw new AppError_1.default(403, 'You are not Authorized');
    }
    // hashed new password
    const newHashedPassword = yield bcrypt_1.default.hash(payload.newPassword, Number(config_1.default.bcrypt_salt_rounds));
    yield users_model_1.User.findOneAndUpdate({
        id: userData.userId,
        role: userData.role,
    }, {
        password: newHashedPassword,
        needsPasswordChange: false,
        passwordChangedAt: new Date(),
    });
});
exports.AuthServices = {
    loginUser,
    changePassword,
    refreshToken,
    forgetPassword,
    resetPassword,
};
