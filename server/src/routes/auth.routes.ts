// taskRoutes.ts
import { Router } from 'express';
import UserMiddleware from '../middleware/user.middleware';
import { createUserSchema, loginUserSchema } from '../schemas/user.schema';
import { AuthController } from '../controllers/Auth.controller';

const authRouter = Router();

// Create a user
authRouter.post('/login', UserMiddleware.UserFormValidation(loginUserSchema),  AuthController.loginUser);


export default authRouter;