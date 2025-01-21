"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleMongooseCastError = (err) => {
    const errorSources = [
        {
            path: err.path,
            message: err.message,
        },
    ];
    const statusCode = 400;
    return {
        statusCode,
        message: 'Invalid ID',
        errorSources,
    };
};
exports.default = handleMongooseCastError;
