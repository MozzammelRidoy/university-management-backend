"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const admin_Controller_1 = require("./admin.Controller");
const admin_ValidationZodSchema_1 = require("./admin.ValidationZodSchema");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
router.get('/', (0, auth_1.default)('admin'), admin_Controller_1.AdminControllers.getAllAdmins);
router.get('/:id', (0, auth_1.default)('admin'), admin_Controller_1.AdminControllers.getSingleAdmin);
router.patch('/:id', (0, auth_1.default)('admin'), (0, validateRequest_1.default)(admin_ValidationZodSchema_1.AdminValidationsZodSchema.updateAdminValidationSchema), admin_Controller_1.AdminControllers.updateAdmin);
router.delete('/:id', (0, auth_1.default)('admin'), admin_Controller_1.AdminControllers.deleteAdmin);
exports.AdminRoutes = router;
