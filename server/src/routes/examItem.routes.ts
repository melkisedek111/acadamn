import { Router } from 'express';
import ValidationMiddleware from '../middleware/validation.middleware';
import AuthMiddleware from '../middleware/auth.middleware';
import { ROLES } from '../utils/constants';
import { createExamItemSchema, deleteExamItemSchema, deleteSpecificExamItemImageSchema, getExamItemsSchema, updateItemSchema } from '../schemas/examItem.schema';
import { ExamItemController } from '../controllers/ExamItem.controller';

const examItemRouter = Router();   
const examMiddleware = [AuthMiddleware.AuthenticationTokenValidation, AuthMiddleware.AuthorizationVerification([ROLES.ADMIN])];
 
examItemRouter.post('/create', [...examMiddleware, ValidationMiddleware.ParameterValidation(createExamItemSchema)], ExamItemController.createExamItem);
examItemRouter.post('/delete', [...examMiddleware, ValidationMiddleware.ParameterValidation(deleteExamItemSchema)], ExamItemController.deleteExamItem);
examItemRouter.post('/update', [...examMiddleware, ValidationMiddleware.ParameterValidation(updateItemSchema)], ExamItemController.updateExamItem);
examItemRouter.post('/delete-image', [...examMiddleware, ValidationMiddleware.ParameterValidation(deleteSpecificExamItemImageSchema)], ExamItemController.deleteSpecificExamItemImage);
examItemRouter.post('/hard-delete', [...examMiddleware, ValidationMiddleware.ParameterValidation(deleteExamItemSchema)], ExamItemController.hardDeleteExamItem);
examItemRouter.get('/get-exam-items', [...examMiddleware, ValidationMiddleware.ParameterValidation(getExamItemsSchema)], ExamItemController.getExamItems);

export default examItemRouter;