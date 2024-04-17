// taskRoutes.ts
import { Router } from 'express';
import UserMiddleware from '../middleware/user.middleware';
import { createUserSchema } from '../schemas/user.schema';
import { UserController } from '../controllers/User.controller';
import AuthMiddleware from '../middleware/auth.middleware';

const userRouter = Router();

userRouter.post('/create', [UserMiddleware.UserFormValidation(createUserSchema)],  UserController.createUser);


export default userRouter;