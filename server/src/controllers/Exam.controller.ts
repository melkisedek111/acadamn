// TaskController.ts
import { Request, Response } from "express";
import { mediator } from "../server";

import { StatusCodes } from "http-status-codes";
import { COMMAND_CLASSES } from "../handlers/CommandHandlers";
import { TCreateExamParams, TExam } from "../types/types/exam.type";
import { getUserProfile } from "../helpers/gerUserFromToken.helper";
import { QUERY_CLASSES } from "../handlers/QueryHandlers";

export class ExamController {
	static async createExam(request: Request, response: Response) {
		try {
			const userToken = getUserProfile(request);
			const createExamParams = {...request.body, userId: userToken.id} as TCreateExamParams;
			 
			const exam = await mediator.sendCommand<TCreateExamParams, TExam>(COMMAND_CLASSES.CreateExamCommand, createExamParams);
			response.status(StatusCodes.CREATED).json(exam);
		} catch (error: any) {
			console.log(error.message);
			response.status(StatusCodes.BAD_REQUEST).json({ error: "Bad Request", details: [{ message: error.message }] });
		}
	}

	static async getExams(request: Request, response: Response) {
		try {
			console.log(123123)
			const exam = await mediator.sendQuery<undefined, any>(QUERY_CLASSES.GetExamQuery, undefined);
			response.status(StatusCodes.CREATED).json(exam);
		} catch (error: any) {
			console.log(error.message);
			response.status(StatusCodes.BAD_REQUEST).json({ error: "Bad Request", details: [{ message: error.message }] });
		}
	}
}
