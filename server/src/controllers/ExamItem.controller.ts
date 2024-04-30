// TaskController.ts
import { Request, Response } from "express";
import { mediator } from "../server";

import { StatusCodes } from "http-status-codes";
import { COMMAND_CLASSES } from "../handlers/CommandHandlers";
import { TCreateExamParams, TExam } from "../types/types/exam.type";
import { getUserProfile } from "../helpers/gerUserFromToken.helper";
import { QUERY_CLASSES } from "../handlers/QueryHandlers";
import { TCreateExamItemParams } from "../types/types/examItem.type";

export class ExamItemController {
	static async createExamItem(request: Request, response: Response) {
		try {
			const createExamItemParams = request.body as TCreateExamItemParams;
			const exam = await mediator.sendCommand<TCreateExamItemParams, TExam>(COMMAND_CLASSES.CreateExamItem, createExamItemParams);
			response.status(StatusCodes.CREATED).json(exam);
		} catch (error: any) {
			console.log(error.message);
			response.status(StatusCodes.BAD_REQUEST).json({ error: "Bad Request", details: [{ message: error.message }] });
		}
	}

    static async getExamItems(request: Request, response: Response) {
		try {
			const queries = request.query;
			const getExamItemsParams: { examId: number } = { examId: Number(queries.examId)}
			const exam = await mediator.sendQuery<{ examId: number }, TExam>(QUERY_CLASSES.GetExamItemQuery, getExamItemsParams);
			response.status(StatusCodes.CREATED).json(exam);
		} catch (error: any) {
			console.log(error.message);
			response.status(StatusCodes.BAD_REQUEST).json({ error: "Bad Request", details: [{ message: error.message }] });
		}
	}
}
