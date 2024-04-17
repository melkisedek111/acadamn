import { NextFunction, Request, Response } from "express";
import { z, ZodError } from "zod";
import { StatusCodes } from "http-status-codes";

class UserMiddleware {
	static UserFormValidation(schema: z.ZodObject<any, any>) {
        return (request: Request, response: Response, next: NextFunction) => {
			try {
				schema.parse(request.body);
				next();
			} catch (error) {
				if (error instanceof ZodError) {
					const errorMessages = error.errors.map((issue: any) => ({
						message: issue.message,
					}));
					response
						.status(StatusCodes.BAD_REQUEST)
						.json({ error: "Invalid data", details: errorMessages });
				} else {
					response
						.status(StatusCodes.INTERNAL_SERVER_ERROR)
						.json({ error: "Internal Server Error" });
				}
			}
		};
	}
}

export default UserMiddleware;