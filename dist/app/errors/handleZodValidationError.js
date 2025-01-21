"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleZodValidationError = (err) => {
    const errorSources = err.issues.map((issuse) => {
        return {
            path: issuse === null || issuse === void 0 ? void 0 : issuse.path[issuse.path.length - 1],
            message: issuse === null || issuse === void 0 ? void 0 : issuse.message,
        };
    });
    const statusCode = 400;
    return {
        statusCode,
        message: 'Validation Error',
        errorSources,
    };
};
exports.default = handleZodValidationError;
