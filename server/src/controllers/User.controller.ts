// TaskController.ts
import { Request, Response } from "express";
import { mediator } from "../server";
import {
	TCreatedUser,
	TCreateUserParams,
	TGetUsersParams,
} from "../types/types/user.type";
import { StatusCodes } from "http-status-codes";
import { TCheckStudentIdentificationIdParams, TStudentIdentification } from "../types/types/studentIdentification.type";
import { QUERY_CLASSES } from "../handlers/QueryHandlers";

export class UserController {

	static async createUser(req: Request, res: Response) {
		try {
			const createUserParams = req.body as TCreateUserParams;

			const user = await mediator.sendCommand<TCreateUserParams, TCreatedUser>(
				"CreateUserCommand", createUserParams
			);

			res.status(StatusCodes.CREATED).json(user);
		} catch (error: any) {
			console.log(error.message);
			res
				.status(StatusCodes.BAD_REQUEST)
				.json({ error: "Bad Request", details: [{ message: error.message }] });
		}
	}

	static async getUsers(req: Request, res: Response) {
		try {
			const getUsersParams = req.body as Partial<TGetUsersParams>;

			const user = await mediator.sendQuery<Partial<TGetUsersParams>, TCreatedUser>(
				QUERY_CLASSES.GetUsersQuery, getUsersParams
			);

			res.status(StatusCodes.OK).json(user);
		} catch (error: any) {
			console.log(error.message);
			res
				.status(StatusCodes.BAD_REQUEST)
				.json({ error: "Bad Request", details: [{ message: error.message }] });
		}
	}
}
