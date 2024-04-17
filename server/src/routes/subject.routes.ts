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
import { createSubjectSchema, setSubjectStatusSchema, updateSubjectSchema } from '../schemas/subject.schema';
import { SubjectController } from '../controllers/Subject.controller';

const subjectRouter = Router();   
const subjectMiddleware = [AuthMiddleware.AuthenticationTokenValidation, AuthMiddleware.AuthorizationVerification([ROLES.ADMIN]), ValidationMiddleware.ParameterValidation(createSubjectSchema)];
const authMiddlewares = [AuthMiddleware.AuthenticationTokenValidation, AuthMiddleware.AuthorizationVerification([ROLES.ADMIN])];
subjectRouter.post('/create', subjectMiddleware, SubjectController.createSubject);
subjectRouter.get('/get-subjects', authMiddlewares, SubjectController.getSubjects);
subjectRouter.post('/update-subject', AuthMiddleware.SetProtectedRoute([ROLES.ADMIN], updateSubjectSchema), SubjectController.updateSubject);
subjectRouter.post('/set-status', AuthMiddleware.SetProtectedRoute([ROLES.ADMIN], setSubjectStatusSchema), SubjectController.setSubjectStatus);


export default subjectRouter;