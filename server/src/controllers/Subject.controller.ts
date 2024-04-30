// TaskController.ts
import { Request, Response } from "express";
import { mediator } from "../server";
import {
	TCreatedUser,
	TCreateUserParams,
} from "../types/types/user.type";
import { StatusCodes } from "http-status-codes";
import { TCheckStudentIdentificationIdParams, TStudentIdentification } from "../types/types/studentIdentification.type";
import { COMMAND_CLASSES } from "../handlers/CommandHandlers";
import { TCreateSubject, TCreateSubjectParams, TGetSubject, TSetSubjectStatusParams, TSubject, TUpdateSubjectParams } from "../types/types/subject.types";
import { QUERY_CLASSES } from "../handlers/QueryHandlers";
import { getUserProfile } from "../helpers/gerUserFromToken.helper";

export class SubjectController {

	static async createSubject(request: Request, response: Response) {
		try {
			const createSubjectParams = request.body as TCreateSubjectParams;
			const subject = await mediator.sendCommand<TCreateSubjectParams, TCreateSubject>(COMMAND_CLASSES.CreateSubjectCommand, createSubjectParams);
			response.status(StatusCodes.CREATED).json(subject);
		} catch (error: any) {
			console.log(error.message);
			response.status(StatusCodes.BAD_REQUEST).json({ error: "Bad Request", details: [{ message: error.message }] });
		}
	}

	static async getSubjects(request: Request, response: Response) {
		try {
			const subjects = await mediator.sendQuery<undefined, TGetSubject>(QUERY_CLASSES.GetSubjectQuery, undefined);
			response.status(StatusCodes.OK).json(subjects);
		} catch (error: any) {
			console.log(error.message);
			response.status(StatusCodes.BAD_REQUEST).json({ error: "Bad Request", details: [{ message: error.message }] });
		}
	}

	static async updateSubject(request: Request, response: Response) {
		try {
			const updateSubjectParams = request.body as TUpdateSubjectParams;
			const subjects = await mediator.sendCommand<TUpdateSubjectParams, TSubject>(COMMAND_CLASSES.UpdateSubjectCommand, updateSubjectParams);
			response.status(StatusCodes.OK).json(subjects);
		} catch (error: any) {
			console.log(error.message);
			response.status(StatusCodes.BAD_REQUEST).json({ error: "Bad Request", details: [{ message: error.message }] });
		}
	}

	static async setSubjectStatus(request: Request, response: Response) {
		try {
			const updateSubjectStatusParams = request.body as TSetSubjectStatusParams;
			const subjects = await mediator.sendCommand<TSetSubjectStatusParams, TSubject>(COMMAND_CLASSES.SetSubjectStatusCommand, updateSubjectStatusParams);
			response.status(StatusCodes.OK).json(subjects);
		} catch (error: any) {
			console.log(error.message);
			response.status(StatusCodes.BAD_REQUEST).json({ error: "Bad Request", details: [{ message: error.message }] });
		}
	}
}
