// taskRoutes.ts
import { Router } from 'express';
import UserMiddleware from '../middleware/user.middleware';
import { createUserSchema, loginUserSchema } from '../schemas/user.schema';
import { AuthController } from '../controllers/Auth.controller';
import ValidationMiddleware from '../middleware/validation.middleware';
import { checkStudentIdentificationSchema, createStudentIdentificationSchema } from '../schemas/student-identification.schema';
import AuthMiddleware from '../middleware/auth.middleware';
import { ROLES } from '../utils/constants';
import StudentIdentificationController from '../controllers/Student-Identification.controller';

const studentIdentificationRouter = Router();   
const studentIdentificationMiddleware = [AuthMiddleware.AuthenticationTokenValidation, AuthMiddleware.AuthorizationVerification([ROLES.ADMIN]), ValidationMiddleware.ParameterValidation(createStudentIdentificationSchema)];

studentIdentificationRouter.post('/check-student-id', ValidationMiddleware.ParameterValidation(checkStudentIdentificationSchema), StudentIdentificationController.checkStudentId);
studentIdentificationRouter.post('/create', studentIdentificationMiddleware, StudentIdentificationController.createStudentIdentification);


export default studentIdentificationRouter;