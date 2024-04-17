import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { TLoggedInUser, TTokenDetails } from "../types/types/user.type";
import { ZodObject } from "zod";
import ValidationMiddleware from "./validation.middleware";

class AuthMiddleware {
	static AuthenticationTokenValidation(
		request: Request,
		response: Response,
		next: NextFunction
	) {
		try {
			const authHeader = request.headers.authorization;

			if (!authHeader?.startsWith("Bearer ")) {
				response.status(StatusCodes.BAD_REQUEST).json({
					error: "Unauthorized",
					details: [{ message: "Token not provided" }],
				});
				return;
			}

			const token = authHeader.split(" ")[1];
			const decoded = jwt.verify(
				token,
				process.env.JWT_SECRET!,
				(error, decoded) => {
					if (error?.message) throw new Error("Token Expired");

					if (decoded) {
						next();
					}
				}
			);
		} catch (error: any) {
			response
				.status(StatusCodes.BAD_REQUEST)
				.json({ error: "Unauthenticated", details: [{ message: error.message }] });
		}
	}
	static AuthorizationVerification(allowedRoles: any) {
		return (request: Request, response: Response, next: NextFunction) => {
			try {
				const token = request.headers.authorization?.split("Bearer ")[1];

				if (!token) throw new Error("Invalid Token");
				
				const decoded = jwt.verify(token, process.env.JWT_SECRET!);
				const { role } = decoded as TTokenDetails;

				if (!allowedRoles.includes(role))  throw new Error("User is unauthorized")

				next();
			} catch (error: any) {
				response
					.status(StatusCodes.UNAUTHORIZED)
					.json({ error: "Unauthorized", details: [{ message: error.message }] });
			}
		};
	}

	static SetProtectedRoute(roles: string[] = [], schema: any = undefined, otherMiddlewares: any[] = []) {
		const middlewares: any[] = [this.AuthenticationTokenValidation, this.AuthorizationVerification(roles)];
		if (schema) middlewares.push(ValidationMiddleware.ParameterValidation(schema));
		if (otherMiddlewares.length) middlewares.push(...otherMiddlewares);

		return middlewares;
	}
}

export default AuthMiddleware;
