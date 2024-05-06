// taskRoutes.ts
import { Router } from 'express';
import ValidationMiddleware from '../middleware/validation.middleware';
import AuthMiddleware from '../middleware/auth.middleware';
import { ROLES } from '../utils/constants';
import { ExamController } from '../controllers/Exam.controller';
import { createExamSchema, updateExamSchema, updateExamStatusSchema } from '../schemas/exam.schema';

const examRouter = Router();   
const examMiddleware = [AuthMiddleware.AuthenticationTokenValidation, AuthMiddleware.AuthorizationVerification([ROLES.ADMIN])];
examRouter.post('/create', [...examMiddleware, ValidationMiddleware.ParameterValidation(createExamSchema)], ExamController.createExam);
examRouter.post('/update', [...examMiddleware, ValidationMiddleware.ParameterValidation(updateExamSchema)], ExamController.updateExam);
examRouter.post('/update-status', [...examMiddleware, ValidationMiddleware.ParameterValidation(updateExamStatusSchema)], ExamController.updateExamStatus);
examRouter.get('/get-exams', examMiddleware, ExamController.getExams);

export default examRouter;