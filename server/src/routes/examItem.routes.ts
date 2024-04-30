// taskRoutes.ts
import { Router } from 'express';
import ValidationMiddleware from '../middleware/validation.middleware';
import AuthMiddleware from '../middleware/auth.middleware';
import { ROLES } from '../utils/constants';
import { ExamController } from '../controllers/Exam.controller';
import { createExamSchema } from '../schemas/exam.schema';
import { createExamItemSchema, getExamItemsSchema } from '../schemas/examItem.schema';
import { ExamItemController } from '../controllers/ExamItem.controller';

const examItemRouter = Router();   
const examMiddleware = [AuthMiddleware.AuthenticationTokenValidation, AuthMiddleware.AuthorizationVerification([ROLES.ADMIN])];
examItemRouter.post('/create', [...examMiddleware, ValidationMiddleware.ParameterValidation(createExamItemSchema)], ExamItemController.createExamItem);
examItemRouter.get('/get-exam-items', [...examMiddleware, ValidationMiddleware.ParameterValidation(getExamItemsSchema, "GET")], ExamItemController.getExamItems);

export default examItemRouter;