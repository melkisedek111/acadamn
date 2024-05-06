// TaskController.ts
import { Request, Response } from "express";
import { mediator } from "../server";

import { StatusCodes } from "http-status-codes";
import { COMMAND_CLASSES } from "../handlers/CommandHandlers";
import { TCreateExamParams, TExam } from "../types/types/exam.type";
import { getUserProfile } from "../helpers/gerUserFromToken.helper";
import { QUERY_CLASSES } from "../handlers/QueryHandlers";
import { TCreateExamItemParams, TDeleteExamItemParams, TDeleteSpecificExamItemImageParams, TExamItem, TUpdateExamItemParams } from "../types/types/examItem.type";

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
			const exam = await mediator.sendQuery<{ examId: number }, TExamItem>(QUERY_CLASSES.GetExamItemQuery, getExamItemsParams);
			response.status(StatusCodes.OK).json(exam);
		} catch (error: any) {
			console.log(error.message);
			response.status(StatusCodes.BAD_REQUEST).json({ error: "Bad Request", details: [{ message: error.message }] });
		}
	}

	static async updateExamItem(request: Request, response: Response) {
		try {
			const updateExamItemParams = request.body as TUpdateExamItemParams;
			const exam = await mediator.sendCommand<TUpdateExamItemParams, TExamItem>(COMMAND_CLASSES.UpdateExamItemCommand, updateExamItemParams);
			response.status(StatusCodes.OK).json(exam);
		} catch (error: any) {
			console.log(error.message);
			response.status(StatusCodes.BAD_REQUEST).json({ error: "Bad Request", details: [{ message: error.message }] });
		}
	}

    static async deleteExamItem(request: Request, response: Response) {
		try {
			const deleteExamItemParams = request.body as TDeleteExamItemParams;
			const exam = await mediator.sendCommand<TDeleteExamItemParams, {}>(COMMAND_CLASSES.DeleteExamItem, deleteExamItemParams);
			response.status(StatusCodes.OK).json(exam);
		} catch (error: any) {
			console.log(error.message);
			response.status(StatusCodes.BAD_REQUEST).json({ error: "Bad Request", details: [{ message: error.message }] });
		}
	}

    static async hardDeleteExamItem(request: Request, response: Response) {
		try {
			const deleteExamItemParams = request.body as TDeleteExamItemParams;
			const exam = await mediator.sendCommand<TDeleteExamItemParams, {}>(COMMAND_CLASSES.HardDeleteExamItem, deleteExamItemParams);
			response.status(StatusCodes.OK).json(exam);
		} catch (error: any) {
			console.log(error.message);
			response.status(StatusCodes.BAD_REQUEST).json({ error: "Bad Request", details: [{ message: error.message }] });
		}
	}

	static async deleteSpecificExamItemImage(request: Request, response: Response) {
		try {
			const deleteSpecificExamItemImageParams = request.body as TDeleteSpecificExamItemImageParams;
			const exam = await mediator.sendCommand<TDeleteSpecificExamItemImageParams, string>(COMMAND_CLASSES.DeleteSpecificExamItemImageCommand, deleteSpecificExamItemImageParams);
			response.status(StatusCodes.OK).json(exam);
		} catch (error: any) {
			console.log(error.message);
			response.status(StatusCodes.BAD_REQUEST).json({ error: "Bad Request", details: [{ message: error.message }] });
		}
	}
}
