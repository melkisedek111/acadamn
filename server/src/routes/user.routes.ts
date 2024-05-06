// taskRoutes.ts
import { Router } from 'express';
import UserMiddleware from '../middleware/user.middleware';
import { createUserSchema, getUsersSchema } from '../schemas/user.schema';
import { UserController } from '../controllers/User.controller';
import AuthMiddleware from '../middleware/auth.middleware';
import { ROLES } from '../utils/constants';

const userRouter = Router();
const middleware = [AuthMiddleware.AuthenticationTokenValidation, AuthMiddleware.AuthorizationVerification([ROLES.ADMIN])];
userRouter.post('/create', [...middleware, UserMiddleware.UserFormValidation(createUserSchema)],  UserController.createUser);
userRouter.post('/get-users', [...middleware, UserMiddleware.UserFormValidation(getUsersSchema)],  UserController.getUsers);


export default userRouter;