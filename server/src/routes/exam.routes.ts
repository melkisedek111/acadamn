// taskRoutes.ts
import { Router } from 'express';
import ValidationMiddleware from '../middleware/validation.middleware';
import AuthMiddleware from '../middleware/auth.middleware';
import { ROLES } from '../utils/constants';
import { ExamController } from '../controllers/Exam.controller';
import { createExamSchema } from '../schemas/exam.schema';

const examRouter = Router();   
const examMiddleware = [AuthMiddleware.AuthenticationTokenValidation, AuthMiddleware.AuthorizationVerification([ROLES.ADMIN]), ValidationMiddleware.ParameterValidation(createExamSchema)];
examRouter.post('/create', examMiddleware, ExamController.createExam);

export default examRouter;