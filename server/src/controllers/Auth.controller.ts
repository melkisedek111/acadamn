// TaskController.ts
import { Request, Response } from "express";
import { mediator } from "../server";
import { TLoggedInUser, TLoginUserParams } from "../types/types/user.type";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { QUERY_CLASSES } from "../handlers/QueryHandlers";

export class AuthController {
	static async loginUser(request: Request, response: Response) {
		try {
			const { password, studentId } = request.body as TLoginUserParams;

			const user = await mediator.sendQuery<TLoginUserParams, TLoggedInUser>(
				QUERY_CLASSES.LoginUserQuery,
				{ password, studentId }
			);

			const token = jwt.sign({ ...user }, process.env.JWT_SECRET!, {
				expiresIn: "2h",
			});

			if (!token) throw new Error("Failed to login.");

			response.clearCookie("jwt");
			response
				.status(StatusCodes.OK)
				.cookie("jwt", token, {
					httpOnly: true,
					// sameSite: "none",
					// secure: false,
					maxAge: 24 * 60 * 60 * 1000,
				})
				.json({ userDetails: { ...user }, token })
		} catch (error: any) {
			console.log(error.message);
			response
				.status(StatusCodes.BAD_REQUEST)
				.json({ error: "Bad Request", details: [{ message: error.message }] });
		}
	}
}
