// TaskController.ts
import { Request, Response } from "express";
import { mediator } from "../server";
import {
	TCreatedUser,
	TCreateUserParams,
} from "../types/types/user.type";
import { StatusCodes } from "http-status-codes";
import { TCheckStudentIdentificationIdParams, TCreateStudentIdentificationParams, TStudentIdentification } from "../types/types/studentIdentification.type";
import { COMMAND_CLASSES } from "../handlers/CommandHandlers";
import { QUERY_CLASSES } from "../handlers/QueryHandlers";

export default class StudentIdentificationController {
	static async checkStudentId(request: Request, response: Response) {
		try {
			const { studentId } = request.body as TCheckStudentIdentificationIdParams;
			const studentIdentification = await mediator.sendQuery<TCheckStudentIdentificationIdParams, TStudentIdentification>(QUERY_CLASSES.CheckStudentIdQuery, { studentId });
			response.status(StatusCodes.OK).json(studentIdentification);
		} catch (error: any) {
			console.log(error.message);
			response
				.status(StatusCodes.BAD_REQUEST)
				.json({ error: "Bad Request", details: [{ message: error.message }] });
		}
	}
    static async createStudentIdentification(request: Request, response: Response) {
		try {
			const { studentId, blockId, yearLevel } = request.body as TCreateStudentIdentificationParams;
			const studentIdentification = await mediator.sendCommand<TCreateStudentIdentificationParams, TStudentIdentification>(COMMAND_CLASSES.CreateStudentIdentificationCommand, { studentId, isRegistered: false, blockId, yearLevel  });
			response.status(StatusCodes.OK).json(studentIdentification);
		} catch (error: any) {
			console.log(error.message);
			response
				.status(StatusCodes.BAD_REQUEST)
				.json({ error: "Bad Request", details: [{ message: error.message }] });
		}
	}
}
