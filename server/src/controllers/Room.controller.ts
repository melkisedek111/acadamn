// TaskController.ts
import { Request, Response } from "express";
import { mediator } from "../server";

import { StatusCodes } from "http-status-codes";
import { COMMAND_CLASSES } from "../handlers/CommandHandlers";
import { TCreateExamParams, TExam, TUpdateExamParams } from "../types/types/exam.type";
import { getUserProfile } from "../helpers/gerUserFromToken.helper";
import { QUERY_CLASSES } from "../handlers/QueryHandlers";
import { TCreateRoomParams } from "../types/types/room.type";

export class RoomController {
	static async createRoom(request: Request, response: Response) {
		try {
            console.log(request.body)
			const createRoomParams = request.body as TCreateRoomParams;
			const room = await mediator.sendCommand<TCreateRoomParams, TExam>(COMMAND_CLASSES.CreateRoomCommand, createRoomParams);
			response.status(StatusCodes.CREATED).json(room);
		} catch (error: any) {
			console.log(error.message);
			response.status(StatusCodes.BAD_REQUEST).json({ error: "Bad Request", details: [{ message: error.message }] });
		}
	}
}
