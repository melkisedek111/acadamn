// TaskController.ts
import { Request, Response } from "express";
import { mediator } from "../server";

import { StatusCodes } from "http-status-codes";
import { COMMAND_CLASSES } from "../handlers/CommandHandlers";
import { TCreateExamParams, TExam, TUpdateExamParams } from "../types/types/exam.type";
import { getUserProfile } from "../helpers/gerUserFromToken.helper";
import { QUERY_CLASSES } from "../handlers/QueryHandlers";
import { TCreateRoomParams, TGetRoomsAndSubjectCounts, TUpdateRoomParams, TUpdateSubjectRoomScheduleParams } from "../types/types/room.type";
import { TGetRoomAssignmentBySubjectAndScheduleParams, TSubjectRoomAssignment } from "../types/types/subjectRoomAssignment";

export class RoomController {
	static async createRoom(request: Request, response: Response) {
		try {
			const createRoomParams = request.body as TCreateRoomParams;
			const room = await mediator.sendCommand<TCreateRoomParams, TExam>(COMMAND_CLASSES.CreateRoomCommand, createRoomParams);
			response.status(StatusCodes.CREATED).json(room);
		} catch (error: any) {
			console.log(error.message);
			response.status(StatusCodes.BAD_REQUEST).json({ error: "Bad Request", details: [{ message: error.message }] });
		}
	}

	static async getRoomsAndSubjectCounts(request: Request, response: Response) {
		try {
			const createRoomParams = request.body as TCreateRoomParams;
			const room = await mediator.sendQuery<any, any>(QUERY_CLASSES.GetRoomsAndSubjectCountsQuery, createRoomParams);
			response.status(StatusCodes.OK).json(room);
		} catch (error: any) {
			console.log(error.message);
			response.status(StatusCodes.BAD_REQUEST).json({ error: "Bad Request", details: [{ message: error.message }] });
		}
	}

	static async updateRoom(request: Request, response: Response) {
		try {
			const updateRoomParams = request.body as TUpdateRoomParams;
			const room = await mediator.sendCommand<TUpdateRoomParams, TGetRoomsAndSubjectCounts>(COMMAND_CLASSES.UpdateRoomCommand, updateRoomParams);
			response.status(StatusCodes.OK).json(room);
		} catch (error: any) {
			console.log(error.message);
			response.status(StatusCodes.BAD_REQUEST).json({ error: "Bad Request", details: [{ message: error.message }] });
		}
	}

	static async assignSubjectToRoomCommand(request: Request, response: Response) {
		try {
			const getRoomAssignmentBySubjectAndScheduleParams = request.body as TGetRoomAssignmentBySubjectAndScheduleParams;
			const room = await mediator.sendCommand<TGetRoomAssignmentBySubjectAndScheduleParams, TSubjectRoomAssignment>(COMMAND_CLASSES.AssignSubjectToRoomCommand, getRoomAssignmentBySubjectAndScheduleParams);
			response.status(StatusCodes.OK).json(room);
		} catch (error: any) {
			console.log(error.message);
			response.status(StatusCodes.BAD_REQUEST).json({ error: "Bad Request", details: [{ message: error.message }] });
		}
	}

	static async updateSubjectRoomSchedule(request: Request, response: Response) {
		try {
			const updateSubjectRoomScheduleParams = request.body as TUpdateSubjectRoomScheduleParams;
			const room = await mediator.sendCommand<TUpdateSubjectRoomScheduleParams, TSubjectRoomAssignment>(COMMAND_CLASSES.UpdateSubjectRoomScheduleCommand, updateSubjectRoomScheduleParams);
			response.status(StatusCodes.OK).json(room);
		} catch (error: any) {
			console.log(error.message);
			response.status(StatusCodes.BAD_REQUEST).json({ error: "Bad Request", details: [{ message: error.message }] });
		}
	}
}
