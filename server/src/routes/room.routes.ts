// taskRoutes.ts
import { Router } from 'express';
import UserMiddleware from '../middleware/user.middleware';
import AuthMiddleware from '../middleware/auth.middleware';
import { ROLES } from '../utils/constants';
import { createRoomSchema, subjectRoomAssignmentSchema, updateRoomSchema, updateSubjectRoomScheduleSchema } from '../schemas/room.schema';
import { RoomController } from '../controllers/Room.controller';
import ValidationMiddleware from '../middleware/validation.middleware';

const roomRouter = Router();
const middleware = [AuthMiddleware.AuthenticationTokenValidation, AuthMiddleware.AuthorizationVerification([ROLES.ADMIN])];
roomRouter.post('/create', [...middleware, ValidationMiddleware.ParameterValidation(createRoomSchema)],  RoomController.createRoom);
roomRouter.post('/update', [...middleware, ValidationMiddleware.ParameterValidation(updateRoomSchema)],  RoomController.updateRoom);
roomRouter.post('/subject-room-assignment', [...middleware, ValidationMiddleware.ParameterValidation(subjectRoomAssignmentSchema)],  RoomController.assignSubjectToRoomCommand);
roomRouter.post('/update-subject-schedule', [...middleware, ValidationMiddleware.ParameterValidation(updateSubjectRoomScheduleSchema)],  RoomController.updateSubjectRoomSchedule);
roomRouter.post('/get-rooms', [...middleware],  RoomController.getRoomsAndSubjectCounts);


export default roomRouter;