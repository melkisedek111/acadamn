// taskRoutes.ts
import { Router } from 'express';
import UserMiddleware from '../middleware/user.middleware';
import AuthMiddleware from '../middleware/auth.middleware';
import { ROLES } from '../utils/constants';
import { createRoomSchema } from '../schemas/room.schema';
import { RoomController } from '../controllers/Room.controller';
import ValidationMiddleware from '../middleware/validation.middleware';

const roomRouter = Router();
const middleware = [AuthMiddleware.AuthenticationTokenValidation, AuthMiddleware.AuthorizationVerification([ROLES.ADMIN])];
roomRouter.post('/create', [...middleware, ValidationMiddleware.ParameterValidation(createRoomSchema)],  RoomController.createRoom);


export default roomRouter;